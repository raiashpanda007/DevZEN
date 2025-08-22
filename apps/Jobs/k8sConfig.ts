import { KubeConfig, AppsV1Api, CoreV1Api,NetworkingV1Api } from "@kubernetes/client-node"

const k8sConfig = new KubeConfig();
if (process.env.KUBERNETES_SERVICE_HOST && process.env.KUBERNETES_SERVICE_PORT) {
    k8sConfig.loadFromCluster();
} else {
    k8sConfig.loadFromDefault();
}
const k8sAppApiClient = k8sConfig.makeApiClient(AppsV1Api);
const k8sCoreApiClient = k8sConfig.makeApiClient(CoreV1Api);
const k8sNetworkClient = k8sConfig.makeApiClient(NetworkingV1Api);
export default k8sConfig
export { k8sAppApiClient, k8sCoreApiClient, k8sNetworkClient }