# SweetWorks -> Helm Charts

### Description
These helm charts are meant to be deployed in any Kubernetes provider service such as AWS EKS, Google Cloud Plataform, Azure and/or Bare Metal K8S installaetion, even Locally using MiniKube.

Also these Helm Charts, deploy the following:
1. **sweetworks**: Nodejs App & Postgress 
2. **sweet-config**: Enironment variables as Kubernetes Secrets

### Requirements
1. Kubernetes API from any Cloud or local environment - **Kubectl**
2. Helm
3. Docker
4. git

### Installation

**Helm**: 
https://docs.helm.sh/using_helm/#installing-helm

**Docker Engine**
https://docs.docker.com/cs-engine/1.13/

**Kubectl**
https://kubernetes.io/docs/tasks/tools/install-kubectl/

### Pre-configure
Run theese commands against your K8S cluster to put in place **HELM**:
`kubectl create serviceaccount --namespace kube-system tiller`

`kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller`

`kubectl patch deploy --namespace kube-system tiller-deploy -p '{"spec":{"template":{"spec":{"serviceAccount":"tiller"}}}}'`

`helm init --service-account tiller`

### Deployment instructions
You would need to follow theese steps in order to get sorted out everything ! 
Let's get it working! 
1. Clone the repo and cd into it
```
git clone 
cd git/helm
```
2.
You'll need to Configure properly some environment variables in **sweet-config/values.yaml**, modify it acordingly using your favorite editor
3. Install those environment variables (Kubernetes Secrets) in K8S cluster:
 `helm install -n sweet-config sweet-config`
4. Install NodeApp & Postgres
  `helm install -n sweetworks sweetworks`
**Where** `-n sweetworks` is the name of the chart and last `sweetworks` the name of the directory
5. To veryfy everything it's going fine, run this command:
`helm list`
6. Optional, to expose a load balancer use this configs
`kb expose service nodeapp --type=LoadBalancer --name=nodeapp-external`
Wait till LoadBalancer is completely created and run
`kubectl get svc | grep nodeapp-external | cut -d: -f1 | awk '{print "http://" $4 ":" $5}'`
And go tho the given URL to test if everything is working well

**And that's it, you app should be up and running**

