import cron from "node-cron";
import { getAllPods } from "./getAllpods";
import axios from "axios";
import { k8sAppApiClient, k8sCoreApiClient, k8sNetworkClient } from "@/k8sConfig"
const listOfServersWithZeroConnection = new Set<string>();
async function DeleteDeployment(PodName: string) {
    try {
        const res = await k8sAppApiClient.deleteNamespacedDeployment({
            name: PodName,
            namespace: "default"
        });
        console.log("Pod Cleared from node :: ", PodName, "Response", res);
    } catch (error) {
        console.error(`Failed to delete deployment ${PodName}`, error);
        throw error;
    }
}


async function DeleteService(ServiceName: string) {
    try {
        const res = await k8sCoreApiClient.deleteNamespacedService({
            name: ServiceName,
            namespace: "default"
        })
        console.log("Service Cleared from node :: ", ServiceName, "Response", res);
    } catch (error) {
        console.error(`Failed to delete Service ${ServiceName}`, error);
        throw error;
    }
}

async function DeleteIngress (IngressName:string) {
    try {
        const res = await k8sNetworkClient.deleteNamespacedIngress({
            name:IngressName,
            namespace:"default"
        })
        console.log("Service Cleared from node :: ", IngressName, "Response", res)
    } catch (error) {
        console.error(`Failed to delete Ingress ${IngressName}`, error);
        throw error;
    }
}

async function CheckNumberOfConnections(PodName: string) {
    const baseDomainName = process.env.DOMAIN_NAME || "devzen.ashprojects.tech";
    try {
        const domain = `http://${PodName}.${baseDomainName}`;
        const response = await axios.get(`${domain}/metrics`);
        if (!response.data.data || response.data.data == 0) {
            if (listOfServersWithZeroConnection.has(PodName)) {
                await DeleteDeployment(PodName);
                await DeleteService(PodName);
                await DeleteIngress(PodName);
                listOfServersWithZeroConnection.delete(PodName);
                return;
            }
            listOfServersWithZeroConnection.add(PodName);
        }

        console.log("Number of connection ", response);

    } catch (error) {
        console.log("Error in check number of connections of domain",error);
    }
}

export async function CleanPods() {
    console.log("Running scheduled pod cleanup job...");
    const allPods = await getAllPods();
    const listPodsWithNoConnection = allPods.map(async (pod) => {
        if (!pod.metadata || !pod.metadata.labels || typeof pod.metadata.labels.app !== "string") {
            throw Error("Pod doesn't have valid metadata or app label in order to delete");
        }
        console.log("Name of pod ::", pod.metadata.labels.app);
        await CheckNumberOfConnections(pod.metadata.labels.app);
    });
    await Promise.all(listPodsWithNoConnection);
}


const podsCleanUpJob = () => {
    cron.schedule('*/10 * * * *', CleanPods);
}


export default podsCleanUpJob;
