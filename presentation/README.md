# Presentation Roadmap

## Architecture and Artifacts
> Describe the architecture of the application using one or more types of UML diagrams (class diagram, component diagram, sequence/collaboration diagram, deployment diagram) - Max 2 points. 
1) Show the slides containing our diagrams

>  Show and describe the artifacts you created to build the docker images - Max 1 point. 
1) Show the `Dockerfile`s for both the `frontend` and `backend`

>  Show and describe the artifacts created to deploy the application to Kubernetes - Max 2 points.
1) Show the contents of the `backend/backend_deployment` folder containing deployment, ingress, service files as well as the yaml files for creating a self-signed certificate.
2) Show the TLS secret by issuing the command `kubectl get secrets` and then `kubectl describe secret my-tls-secret`
3) Show the contents of the `backend/postgres` folder containing the yaml files for the deployment of the database.
4) Show the contents of the `frontend/frontend_deployment` folder that contains the frontend deployment yaml files.

## Pre-requisites
> Show how you configured the pre-requisites for the application (Load Balancer - 1 point, Storage Class - 1 point, image Registry - 1 point, certificates - 1 point, roles - 1 point, network policies - 1 point).
1) Show load balancer: `kubectl -n metallb-system describe configmap`. Also show the backend and frontend service files and point to their types `LoadBalancer`.
2) Show storage class: `kubectl get sc`
3) Show registry: `microk8s ctr images ls | grep localhost`
4) Use these commands to verify TLS connectivity for the UI and the API:
    * `openssl s_client -showcerts -connect quiz-app.com:443`
    * `openssl s_client -showcerts -connect api.quiz-app.com:443`
5) `microk8s status` and show the plugins such as MetalLB and Helm3 etc.
6) TODO roles
7) TODO network policies

## Container build and first deployment, scaling, uninstallation
> Show how you build the container images and publish to a registry (1 point).
* Build the UI images
1) Build the docker image inside the /frontend directory: `sudo docker build -t quiz-ui:<version-number> .`
2) Tag the image: `sudo docker tag quiz-ui:<version-number> localhost:32000/quiz-ui:<version-number>`
3) Push the image: `sudo docker push localhost:32000/quiz-ui:<version-number>` 

* Build the API images
1) Build the docker image inside the /backend directory: `sudo docker build -t quiz-app:<version-number> .`
2) Tag the image: `sudo docker tag quiz-app:<version-number> localhost:32000/quiz-app:<version-number>`
3) Push the image: `sudo docker push localhost:32000/quiz-app:<version-number>`

> Show how you deploy the application for the first time (1 point).
1) Create namespace: `kubectl create namespace quiz-app-helm`
2) Install Helm chart: `microk8s helm3 install quiz-app-helm ./quiz-app-chart/ -n quiz-app-helm`

> Show how to scale the application horizontally (stateless parts only) (1 point).
1) `kubectl -n quiz-app-helm scale deployment/quiz-api-deployment --replicas=5`

> Show how to uninstall the application (1 point)
1) Uninstall Helm chart: `microk8s helm3 uninstall quiz-app-helm -n quiz-app-helm`

## Application upgrade and re-deployment
> Show how you re-build the application after a source code change (1 point). Show how you upgrade the running application in two ways: deployment rollout (2 points) and canary update (2 points).

> Rolling Update
1) Make a change in the UI code.
2) Build the docker image inside the /frontend directory: `sudo docker build -t quiz-ui:v8 .`
3) Tag the image: `sudo docker tag quiz-ui:v6-helm localhost:32000/quiz-ui:v8`
4) Push the image to the registry: `sudo docker push localhost:32000/quiz-ui:v8`
5) Change the Helm `Chart version` and `appVersion` in the directory `helm/quiz-app-chart/charts/quizUI/Chart.yaml`
6) Upgrade Helm inside the `helm` directory: `microk8s helm3 upgrade quiz-app-helm ./quiz-app-chart/ -n quiz-app-helm`
7) Watch the rollout process: `kubectl -n quiz-app-helm get pods -w`
8) Show the changed UI.

> Canary Update
1) Apply the deployment for canary update: `kubectl -n quiz-app-helm apply -f quiz-ui-canary.yaml`
2) Show the labels: `kubectl -n quiz-app-helm get pods --show-labels -w`