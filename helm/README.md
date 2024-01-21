# HELM SETUP

## Directions (inside the helm directory)
1. Create the namespace: `kubectl create namespace quiz-app-helm`
2. Create DB path: `sudo mkdir -p /opt/postgres/helm-data`
3. Verify Helm charts: `microk8s helm3 install quiz-app-helm ./quiz-app-chart/ -n quiz-app-helm --dry-run`
4. Install Helm charts: `microk8s helm3 install quiz-app-helm ./quiz-app-chart/`
Note: Make sure that the images required for deployment are in the microk8s repo.  

## DNS Setup
Make sure to add these lines to `/etc/hosts` by issuing `sudo nano /etc/hosts`:  
`127.0.0.1 quiz-app-helm.com`  
`127.0.0.1 api.quiz-app-helm.com`  

## Helm commands
1) `microk8s helm3 ls -n quiz-app-helm`
2) `microk8s helm3 status <release-name> -n quiz-app-helm `
3) scale horizontally: `kubectl -n quiz-app-helm scale deployment/quiz-api-deployment --replicas=5`
4) get pods in the namespace: `kubectl get pods -n quiz-app-helm`
5) upgrade after making a change in the charts: `microk8s helm3 upgrade quiz-app-helm ./quiz-app-chart/ -n quiz-app-helm`
6) to delete all pods (for example for the api) after upgrading so they are re-generated: `kubectl delete pods --selector=app=quiz-api --namespace=quiz-app-helm` (change the selector to `quiz-ui` to delete ui pods)