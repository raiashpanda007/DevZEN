import express from 'express';
import { copyFolder, deleteFolder } from './aws';
import { z as zod } from 'zod';
import fs from "fs";
import yaml from "yaml";
import cors from "cors";
import dotnev from "dotenv"
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
kubeconfig.loadFromCluster()
const coreV1Api = kubeconfig.makeApiClient(CoreV1Api);
const appsV1Api = kubeconfig.makeApiClient(AppsV1Api);
const networkingV1Api = kubeconfig.makeApiClient(NetworkingV1Api);


const readAndParseYAMLFiles = (filePath: string, projectId: string) => {
    const content = fs.readFileSync(filePath, "utf-8");
    const yamlDocs = yaml.parseAllDocuments(content).map((doc) => {
        let docString = doc.toString();
        // Regex pattern matching in order to change service name to replid
        const regex = new RegExp(`service_name`, 'g');
        docString = docString.replace(regex, projectId);

        return yaml.parse(docString);

    });

    return yamlDocs;
}



app.post('/project', async (req, res) => {
    console.log("Received Body:", req.body);
    try {
        const body = req.body;
        const { projectId, language } = CreateProjectSchemaBackend.parse(body);
        if (!projectId || !language) {
            res.status(400).send("Invalid request body");
            return;
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
