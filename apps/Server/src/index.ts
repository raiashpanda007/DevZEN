import express from 'express';
import { copyFolder, deleteFolder } from './aws';
import {  z as zod } from 'zod';
import fs from "fs";
import yaml from "yaml";
import cors from "cors";
import dotnev from "dotenv"
import path from "path"
import { KubeConfig, CoreV1Api, AppsV1Api, NetworkingV1Api, CustomObjectsApi } from "@kubernetes/client-node"
dotnev.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CreateProjectSchemaBackend = zod.object({
    projectId: zod.string().nonempty(),
    language: zod.string().nonempty(),
})
export const StartProjectSchema = zod.object({
  projectId:zod.string().nonempty(),
})
app.use(express.json());
app.use(
    cors({ origin: process.env.WEB_URL })
)


const kubeconfig = new KubeConfig();
if (process.env.KUBERNETES_SERVICE_HOST && process.env.KUBERNETES_SERVICE_PORT) {
    kubeconfig.loadFromCluster(); // Inside a pod
} else {
    kubeconfig.loadFromDefault(); // Local dev
}
const coreV1Api = kubeconfig.makeApiClient(CoreV1Api);
const appsV1Api = kubeconfig.makeApiClient(AppsV1Api);
const networkingV1Api = kubeconfig.makeApiClient(NetworkingV1Api);
const customObjectsApi = kubeconfig.makeApiClient(CustomObjectsApi);


const readAndParseYAMLFiles = (filePath: string, projectId: string) => {
    const content = fs.readFileSync(filePath, "utf-8");
    const yamlDocs = yaml.parseAllDocuments(content).map((doc) => {
        const obj = doc.toJS();

        const replaceInObject = (val: any): any => {
            if (typeof val === "string") {
                return val.replace(/service_name/g, projectId);
            } else if (Array.isArray(val)) {
                return val.map(replaceInObject);
            } else if (typeof val === "object" && val !== null) {
                const replaced: any = {};
                for (const key in val) {
                    replaced[key] = replaceInObject(val[key]);
                }
                return replaced;
            }
            return val;
        };

        return replaceInObject(obj);
    });

    return yamlDocs;
};



app.post('/project', async (req, res) => {
    console.log("Received Body:", req.body);
    const namespace = "default";
    try {
        const body = req.body;
        const { projectId, language } = CreateProjectSchemaBackend.parse(body);
        if (!projectId || !language) {
            res.status(400).send("Invalid request body");
            return;
        }

        // 1. Copy template code to project path in S3 BEFORE deploying
        console.log(`Copying base template base_code_files/${language} -> code/${projectId}`);
        await copyFolder(`base_code_files/${language}`, `code/${projectId}`);
        console.log("Template copy completed.");

        // 2. Prepare manifests (service_name -> projectId)
        const kubeManifests = readAndParseYAMLFiles(path.join(__dirname, "../k8s/services.yml"), projectId);


        // 3. Create Kubernetes resources
        // Split Certificates so we create Ingress (and related resources) first,
        // then create Certificate CRs. This ensures cert-manager can perform HTTP-01
        // challenge against an existing Ingress.
        const certManifests: any[] = [];
        const otherManifests: any[] = [];
        for (const m of kubeManifests) {
            if (m.kind === 'Certificate') certManifests.push(m);
            else otherManifests.push(m);
        }

        // Create non-Certificate resources first
        for (const manifest of otherManifests) {
            try {
                console.log(`Creating ${manifest.kind} → ${manifest.metadata?.name}`);
                switch (manifest.kind) {
                    case "Deployment":
                        await appsV1Api.createNamespacedDeployment({ namespace, body: manifest });
                        break;
                    case "Service":
                        await coreV1Api.createNamespacedService({ namespace, body: manifest });
                        break;
                    case "Ingress":
                        await networkingV1Api.createNamespacedIngress({ namespace, body: manifest });
                        break;
                    default:
                        console.log(`Unsupported kind: ${manifest.kind}`);
                }
            } catch (err: any) {
                if (err?.response?.statusCode === 409) {
                    console.warn(`${manifest.kind} already exists for ${projectId}`);
                } else {
                    throw err;
                }
            }
        }

        // Now create Certificate CRs (if any). These require Ingress to exist.
        for (const manifest of certManifests) {
            try {
                console.log(`Creating Certificate → ${manifest.metadata?.name}`);
                await (customObjectsApi as any).createNamespacedCustomObject(
                    "cert-manager.io",
                    "v1",
                    namespace,
                    "certificates",
                    manifest
                );
            } catch (err: any) {
                if (err?.response?.statusCode === 409) {
                    console.warn(`Certificate already exists for ${projectId}`);
                } else {
                    // Log and continue — failure creating a certificate shouldn't stop resource creation
                    console.error(`Error creating Certificate for ${projectId}:`, err);
                }
            }
        }
    } catch (error) {
        console.error("Error in creating project:", error);
        res.status(500).send("Error creating project");
        return;
    }


    res.send("Project created");
});

app.post('/start', async (req, res): Promise<any> => {
    const namespace = "default";
    const parsedBody = StartProjectSchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json("Please provide project id to start project");
    }
    const { projectId } = parsedBody.data;
    try {
        // Check if any Deployment already exists for this projectId
        const listResp = await appsV1Api.listNamespacedDeployment({ namespace });
        const deployments = listResp.items || [];
        const alreadyRunning = deployments.some(d => {
            const name = d.metadata?.name || "";
            return name.includes(projectId);
        });
        if (alreadyRunning) {
            console.log(`Project ${projectId} already has a Deployment running`);
            return res.status(200).send("Project already running");
        }

        const kubeManifests = readAndParseYAMLFiles(path.join(__dirname, "../k8s/services.yml"), projectId);
        // Apply non-Certificate resources first, then Certificate CRs so cert-manager
        // can perform HTTP-01 challenges against an existing Ingress.
        const certManifestsStart: any[] = [];
        const otherManifestsStart: any[] = [];
        for (const m of kubeManifests) {
            if (m.kind === 'Certificate') certManifestsStart.push(m);
            else otherManifestsStart.push(m);
        }

        for (const manifest of otherManifestsStart) {
            try {
                console.log(`Creating ${manifest.kind} → ${manifest.metadata?.name}`);
                switch (manifest.kind) {
                    case "Deployment":
                        await appsV1Api.createNamespacedDeployment({ namespace, body: manifest });
                        break;
                    case "Service":
                        await coreV1Api.createNamespacedService({ namespace, body: manifest });
                        break;
                    case "Ingress":
                        await networkingV1Api.createNamespacedIngress({ namespace, body: manifest });
                        break;
                    default:
                        console.log(`Unsupported kind: ${manifest.kind}`);
                }
            } catch (err: any) {
                if (err?.response?.statusCode === 409) {
                    console.warn(`${manifest.kind} already exists for ${projectId}`);
                } else {
                    console.error(`Error creating ${manifest.kind}:`, err);
                    throw err;
                }
            }
        }

        for (const manifest of certManifestsStart) {
            try {
                console.log(`Creating Certificate → ${manifest.metadata?.name}`);
                await (customObjectsApi as any).createNamespacedCustomObject(
                    "cert-manager.io",
                    "v1",
                    namespace,
                    "certificates",
                    manifest
                );
            } catch (err: any) {
                if (err?.response?.statusCode === 409) {
                    console.warn(`Certificate already exists for ${projectId}`);
                } else {
                    console.error(`Error creating Certificate for ${projectId}:`, err);
                }
            }
        }
        // Only send response once, after all manifests processed
        res.status(200).send("Project started");
    } catch (error) {
        console.error("Unable to start your project", error);
        // Only send error response if not already sent
        if (!res.headersSent) {
            res.status(500).send("Unable to start your project");
        }
    }
});

app.delete('/project', async (req, res): Promise<any> => {
    try {
        const { projectId } = req.body;
        if (!projectId) {
            return res.status(400).send("Invalid request body")
        }

        const response = await deleteFolder(projectId);

        res.status(201).json(
            response
        )

    } catch (error) {
        console.error("The code files are not deleted from the S3 bucket")
    }

})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
