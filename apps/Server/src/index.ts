import express from 'express';
import { copyFolder } from './aws';
import { z as zod } from 'zod';

const app = express();
const PORT = process.env.PORT || 3001;
const CreateProjectSchemaBackend = zod.object({
    projectId: zod.string().nonempty(),
    language: zod.string().nonempty(),
})
app.use(express.json());

app.post('/project', async (req, res) => {
    console.log("Received Body:", req.body); // Log request body to debug
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


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
