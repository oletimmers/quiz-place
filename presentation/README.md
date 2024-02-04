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
5) Show how those files were carried over to Helm and that Helm is used for deployment.

## Pre-requisites
> Show how you configured the pre-requisites for the application (Load Balancer - 1 point, Storage Class - 1 point, image Registry - 1 point, certificates - 1 point, roles - 1 point, network policies - 1 point).
1) Show load balancer: `kubectl -n metallb-system describe configmap`. Also show the backend and frontend service files and point to their types `LoadBalancer`.
2) Show storage class: `kubectl get sc`
3) Show registry: `microk8s ctr images ls | grep localhost`
4) Use these commands to verify TLS connectivity for the UI and the API:
    * `openssl s_client -showcerts -connect quiz-app-helm.com:443`
    * `openssl s_client -showcerts -connect api.quiz-app-helm.com:443`
5) `microk8s status` and show the plugins such as MetalLB and Helm3 etc.
6) Role Based Access Control:
   * Check the role permissions for the admin "adrian", network-dev "nathan" and visitor "veronica":
      ```bash
      # Check Pod access permissions
      microk8s kubectl auth can-i list pod --namespace quiz-app-helm --as adrian
      microk8s kubectl auth can-i list pod --namespace quiz-app-helm --as nathan
      microk8s kubectl auth can-i list pod --namespace quiz-app-helm --as veronica
      # Check Pod modification permissions
      microk8s kubectl auth can-i delete pod --namespace quiz-app-helm --as adrian
      microk8s kubectl auth can-i delete pod --namespace quiz-app-helm --as nathan
      microk8s kubectl auth can-i delete pod --namespace quiz-app-helm --as veronica
      # Check Networkpolicies access permissions
      microk8s kubectl auth can-i get networkpolicies --namespace quiz-app-helm --as adrian
      microk8s kubectl auth can-i get networkpolicies --namespace quiz-app-helm --as nathan
      microk8s kubectl auth can-i get networkpolicies --namespace quiz-app-helm --as veronica
      # Check Networkpolicies modification permissions
      microk8s kubectl auth can-i create networkpolicies --namespace quiz-app-helm --as adrian
      microk8s kubectl auth can-i create networkpolicies --namespace quiz-app-helm --as nathan
      microk8s kubectl auth can-i create networkpolicies --namespace quiz-app-helm --as veronica
      ```
   * Test the role permissions (update the Bearer tokens based on the tokens assigned to the users in the Static Token File):
     * Set the necessary environmental variables
       ```bash
       export CLUSTER_NAME="microk8s-cluster"
       APISERVER=$(microk8s kubectl config view -o jsonpath="{.clusters[?(@.name==\"$CLUSTER_NAME\")].cluster.server}")
       export POD="quiz-ui-deployment-869d659ff7-7bhd9"
       ```
     * Test Pod and Networking access Nathan
       ```bash
       export BEARER_TOKEN="RPzU2sXP2xdwGeGWcFkTmIGZtPDrzPNSlIX+X3Z11I2FYUTXNxPUKxdTDCEknwso"
       curl -X GET $APISERVER/api/v1/namespaces/quiz-app-helm/pods --header "Authorization: Bearer $BEARER_TOKEN" --insecure
       ```
       ```bash
       curl -X DELETE $APISERVER/api/v1/namespaces/quiz-app-helm/pods --header "Authorization: Bearer $BEARER_TOKEN" --insecure
       ```
       ```bash
       curl -X GET $APISERVER/apis/networking.k8s.io/v1/namespaces/quiz-app-helm/networkpolicies --header "Authorization: Bearer $BEARER_TOKEN" --insecure 
       ```
     * Test Pod and Networking access Veronica
       ```bash
       export BEARER_TOKEN="9plbeR0CwCFku7YOdSidqy9rRqvId3NWLDfyeORdneEbzns5vP1p5/gCTT/T1t28"
       curl -X GET $APISERVER/api/v1/namespaces/quiz-app-helm/pods --header "Authorization: Bearer $BEARER_TOKEN" --insecure
       ```
       ```bash
       curl -X DELETE $APISERVER/api/v1/namespaces/quiz-app-helm/pods --header "Authorization: Bearer $BEARER_TOKEN" --insecure
       ```
       ```bash
       curl -X GET $APISERVER/apis/networking.k8s.io/v1/namespaces/quiz-app-helm/networkpolicies --header "Authorization: Bearer $BEARER_TOKEN" --insecure 
       ```
     * Test Pod and Networking access Adrian
       ```bash
       export BEARER_TOKEN="9ZGIaSx/bizd+YUxkFSvvU5GYfVDiWidQhCRTsac8LTee92TikbKW5MkWc+yrMHI"
       curl -X GET $APISERVER/api/v1/namespaces/quiz-app-helm/pods --header "Authorization: Bearer $BEARER_TOKEN" --insecure
       ```
       ```bash
       curl -X DELETE $APISERVER/api/v1/namespaces/quiz-app-helm/pods --header "Authorization: Bearer $BEARER_TOKEN" --insecure
       ```
       ```bash
       curl -X GET $APISERVER/apis/networking.k8s.io/v1/namespaces/quiz-app-helm/networkpolicies --header "Authorization: Bearer $BEARER_TOKEN" --insecure 
       ```
7) Network Policies:
    1. Database can only be accessed by the API (deny database access to pods that don't have the label `app = quiz-api`):
        * Create a pod that doesn't have the label `app = quiz-api`: `kubectl run test-$RANDOM --namespace=quiz-app-helm --rm -i -t --image=busybox -- sh`
        * Inside the shell, issue the command `telnet quiz-db-service 5432`
        * Observe that the connection is not successful

        * Now create a pod with the appropriate label: `kubectl run test-$RANDOM --namespace=quiz-app-helm --rm -i -t --image=busybox --labels=app=quiz-api -- sh`
        * Try the previous command again: `telnet quiz-db-service 5432`
        * Observe that the connection is successful

    2. UI egress is only allowed to the API, and it is prevented for other hosts. UI can only make calls to our API.
        * Create a pod like so: `kubectl run test-$RANDOM --image=curlimages/curl:latest --namespace=quiz-app-helm -- sleep infinity`
        * Note the name of the pod that is created (the name looks like `test-someNumber`)
        * Enter the pod: `kubectl exec -it name_of_pod -n quiz-app-helm -- /bin/sh`
        * Issue command `curl -L google.com` and view that it's successful
        * Delete the pod: `kubectl delete pod name_of_pod -n quiz-app-helm`

        * Create another pod like so, that has the label `quiz-ui`: `kubectl run test-$RANDOM --image=curlimages/curl:latest --namespace=quiz-app-helm --labels=app=quiz-ui -- sleep infinity`
        * Note the name of the pod that is created (the name looks like `test-someNumber`)
        * Enter the pod: `kubectl exec -it name_of_pod -n quiz-app-helm -- /bin/sh`
        * Issue command `curl -L google.com` and view that it is not succesful
        * Delete the pod: `kubectl delete pod name_of_pod -n quiz-app-helm`

        * Finally show that the webpage is running without any problem on the browser, showing that the API can be reached from the UI.
    
    3. API egress is only allowed to the database and the API itself, also to kube-system namespace.
        * We saw in the previous network policy that a pod that is in the correct namespace but doesn't have any labels can succesfully curl to google.com

        * Now create a pod with the label `quiz-api`: `kubectl run test-$RANDOM --image=curlimages/curl:latest --namespace=quiz-app-helm --labels=app=quiz-api -- sleep infinity`
        * Note the name of the pod that is created (the name looks like `test-someNumber`)
        * Enter the pod: `kubectl exec -it name_of_pod -n quiz-app-helm -- /bin/sh`
        * Issue command `curl -L google.com` and view that it is not succesful
        * Delete the pod: `kubectl delete pod name_of_pod -n quiz-app-helm`
8) Finally, show here that the application can make one `GET` request (such as getting the courses) and one `POST` request (creating course/question/answer)
        
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
2) `kubectl get pod -n quiz-app-helm` and show that there are 5 pods now

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

## GCP
* Lookaround of the GCP Console and setup
* Rolling update within GCP
1) Make a change in the UI code.
2) Build the docker image inside the /frontend directory: `sudo docker build -t quiz-ui:v8 .`
3) Tag the image: `docker tag quiz-ui:v8 europe-west4-docker.pkg.dev/sc-group31/quiz-place-repository/quiz-ui:v8`
4) Push the image to the registry: `docker push europe-west4-docker.pkg.dev/sc-group31/quiz-place-repository/quiz-ui:v8`
5) Change the Helm `image`-tag in the `frontend/frontend_deployment/gpc-ui-deployment.yaml` to the new version.
6) Apply the new version of the `gpc-ui-deployment.yaml` file with `kubectl apply -f gpc-ui-deployment.yaml`
7) Watch the rollout process via GCP Console.
8) Show the changed UI.
