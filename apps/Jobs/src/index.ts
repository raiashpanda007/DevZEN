import express from 'express';
import cors from "cors";
import dotnev from "dotenv"
import { getAllPods } from './controllers/getAllpods';
dotnev.config()
const app = express();
const PORT = process.env.PORT || 3002
app.use(express.json());
app.use(cors({
    origin: "*"
}))


app.get("/", async (req, res): Promise<any> => {
    return res.status(200).json({
        status: 200,
        message: "Server is running fine"
    })
})

app.get("/getallPods", async (req, res): Promise<any> => {
    const listAllPods = await getAllPods();
    return res.status(200).json({
        message: "All pods running in default namespace",
        data: listAllPods
    })
})


app.listen(PORT, () => {
    console.log("Jobs Server is running fine ", PORT)
})



