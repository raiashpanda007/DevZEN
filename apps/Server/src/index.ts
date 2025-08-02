import express from 'express';
import { copyFolder, deleteFolder } from './aws';
import { z as zod } from 'zod';
import fs from "fs";
import yaml from "yaml";
import cors from "cors";
import dotnev from "dotenv"
import path from "path"
import { KubeConfig, CoreV1Api, AppsV1Api, NetworkingV1Api } from "@kubernetes/client-node"
dotnev.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CreateProjectSchemaBackend = zod.object({
    projectId: zod.string().nonempty(),
    language: zod.string().nonempty(),
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
        const kubeManifests = readAndParseYAMLFiles(path.join(__dirname, "../k8s/services.yml"), projectId);
        for (const manifest of kubeManifests) {
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
        await copyFolder(`base_code_files/${language}`, `code/${projectId}`);
    } catch (error) {
        console.error("Error in creating project:", error);
        res.status(500).send("Error creating project");
        return;

    }

    res.send("Project created");
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
