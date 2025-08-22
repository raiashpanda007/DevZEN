import { KubeConfig, CoreV1Api } from "@kubernetes/client-node"
import type {V1Pod} from "@kubernetes/client-node"
export async function getAllPods():Promise<V1Pod[]> {
    const k8sConfig = new KubeConfig();
    if (process.env.KUBERNETES_SERVICE_HOST && process.env.KUBERNETES_SERVICE_PORT) {
        k8sConfig.loadFromCluster();
    } else {
        k8sConfig.loadFromDefault();
    }
    const k8sCoreV1Api = k8sConfig.makeApiClient(CoreV1Api);
    const namespace = "default"
    const allPods = await k8sCoreV1Api.listNamespacedPod({ namespace })
    console.log("All the pods in default namespace :: ", allPods);
    return allPods.items
}

