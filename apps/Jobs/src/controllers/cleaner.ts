import cron from "node-cron";
import { getAllPods } from "./getAllpods";
import axios from "axios";
async function CheckNumberOfConnections(PodName: string) {
    const baseDomainName = process.env.DOMAIN_NAME || "devzen.ashprojects.tech";
    try {
        const domain = `${PodName}.${baseDomainName}`;
        const response = await axios.get(`${domain}/metrics`);

        console.log("Number of connection ", response);

    } catch (error) {
        console.log("Error in check number of connections of domain");
    }
}

export async function CleanPods() {
    const allPods = await getAllPods();
    const listPodsWithNoConnection = allPods.map(async (pod) => {
        if (!pod.metadata || !pod.metadata.labels || typeof pod.metadata.labels.app !== "string") {
            throw Error("Pod doesn't have valid metadata or app label in order to delete");
        }
        await CheckNumberOfConnections(pod.metadata.labels.app);
    });
    await Promise.all(listPodsWithNoConnection);
}


const podsCleanUpJob = () => {
    cron.schedule('*/1 * * * *', CleanPods);
}


export default podsCleanUpJob;
