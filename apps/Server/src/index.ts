import express from 'express';
import { copyFolder,deleteFolder } from './aws';
import { z as zod } from 'zod';

const app = express();
const PORT = process.env.PORT || 3001;
const CreateProjectSchemaBackend = zod.object({
    projectId: zod.string().nonempty(),
    language: zod.string().nonempty(),
})
app.use(express.json());

app.post('/project', async (req, res) => {
    console.log("Received Body:", req.body); 
    try {
        const body = req.body;
        const { projectId, language } = CreateProjectSchemaBackend.parse(body);
        if(!projectId || !language) {
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

app.delete('/project', async (req, res) : Promise<any> => {
    try {
        const {projectId} = req.body;
        if(!projectId) {
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
