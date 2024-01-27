# HELM SETUP

## Role-Based Access Control

1) Add the users "adrian" and "veronica" to the Static Token File:
   - Generate a random token for both users using `openssl rand -base64 48`
   - `sudo nano /var/snap/microk8s/current/credentials/known_tokens.csv` to open the Static Token File and add a line for each user.
     The line should look like: 9ZGIaSx/bizd+YUxkFSvvU5GYfVDiWidQhCRTsac8LTee92TikbKW5MkWc+yrMHI,adrian,adrianid
   - Save the file and stop and start microk8s (i.e. `microk8s stop`, followed by `microk8s start`).
2) Ensure that RBAC is enabled using `microk8s status` (if not, run `microk8s enable rbac`).
3) Install or upgrade the Helm charts using the steps in the sections below.

### How to test RBAC

Once the application is up and running, it is possible to check the access control in two ways:
1) *Check the user permissions:*
   Issue the command `microk8s kubectl auth can-i list pod --namespace quiz-app-helm --as adrian` to check whether "adrian"
   is authorised to list the pods. Similarly, you can check "veronica" or an unknown user (e.g. "ursula").
2) *Test the permissions with the REST API*:
    - Run `microk8s kubectl config view -o jsonpath='{"Cluster name\tServer\n"}{range.clusters[*]}{.name}{"\t"}{.cluster.server}{"\n"}{end}'
 Cluster nameServer` to get the cluster name (e.g. "microk8s-cluster")
    - `export CLUSTER_NAME="<cluster-name>"` (e.g. `export CLUSTER_NAME="microk8s-cluster"`)
    - `APISERVER=$(microk8s kubectl config view -o jsonpath="{.clusters[?(@.name==\"$CLUSTER_NAME\")].cluster.server}")`
    - List the pods using `microk8s kubectl get pods -n quiz-app-helm`.
    - To test whether adrian has the permissions to get a pod, issue the following command: 
      `curl -X GET $APISERVER/api/v1/namespaces/quiz-app-helm/pods/<pod-name> --header "Authorization Bearer <bearer-token>" --insecure`
      (replace <pod-name> with the desired pod you want to see and use the <bearer-token> of the user you want to see the permissions for).

## Directions (inside the helm directory)
1. Create the namespace: `kubectl create namespace quiz-app-helm`
2. Create DB path: `sudo mkdir -p /opt/postgres/helm-data`
3. Verify Helm charts: `microk8s helm3 install quiz-app-helm ./quiz-app-chart/ -n quiz-app-helm --dry-run`
4. Install Helm charts: `microk8s helm3 install quiz-app-helm ./quiz-app-chart/ -n quiz-app-helm`
Note: Make sure that the images required for deployment are in the microk8s repo.  

## TO UPGRADE
1) If you make a change to the frontend or the backend images make sure to bump up the `chart version` and the `appVersion` in their `Chart.yaml` files (the `appVersion` should be the same as the version of the tagged image)
2) YOU MAY SKIP THIS:   also bump up the versions in the top level `Chart.yaml` file inside the `quiz-app-chart` directory
3) issue the command `microk8s helm3 upgrade quiz-app-helm ./quiz-app-chart/ -n quiz-app-helm`
4) you may delete the respective pods so they are regenerated with the newest images (delete either the api or ui pods, depending on which image you changed): `kubectl delete pods --selector=app=quiz-api --namespace=quiz-app-helm` or `kubectl delete pods --selector=app=quiz-ui --namespace=quiz-app-helm`

## DNS Setup
Make sure to add these lines to `/etc/hosts` by issuing `sudo nano /etc/hosts`:  
`127.0.0.1 quiz-app-helm.com`  
`127.0.0.1 api.quiz-app-helm.com`  

## Helpful Helm commands
1) see releases: `microk8s helm3 ls -n quiz-app-helm`
2) `microk8s helm3 status <release-name> -n quiz-app-helm `
3) scale horizontally: `kubectl -n quiz-app-helm scale deployment/quiz-api-deployment --replicas=5`
4) get pods in the namespace: `kubectl get pods -n quiz-app-helm`
5) upgrade after making a change in the charts (in `helm` directory): `microk8s helm3 upgrade quiz-app-helm ./quiz-app-chart/ -n quiz-app-helm`
6) to delete all pods (for example for the api) after upgrading so they are re-generated: `kubectl delete pods --selector=app=quiz-api --namespace=quiz-app-helm` (change the selector to `quiz-ui` to delete ui pods)
7) to list all releases in all namespaces: `microk8s helm3 ls -aA`
8) delete existing helm release: `microk8s helm3 delete <release-name> -n quiz-app-helm`
9) to uninstall helm chart: `microk8s helm3 uninstall quiz-app-helm -n quiz-app-helm`
10) get deployment: `kubectl get deployment -n quiz-app-helm`

