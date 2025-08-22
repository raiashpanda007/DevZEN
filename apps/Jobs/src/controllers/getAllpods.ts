import type { V1Pod } from "@kubernetes/client-node"
import { CoreV1Api } from "@kubernetes/client-node";
import k8sConfig from "@/k8sConfig";
export async function getAllPods(): Promise<V1Pod[]> {
    const k8sCoreV1Api = k8sConfig.makeApiClient(CoreV1Api);
    const namespace = "default"
    const allPods = await k8sCoreV1Api.listNamespacedPod({ namespace })
    return allPods.items
}

