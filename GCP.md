# Google Cloud Platform installation
Steps took to deploy the quiz-place application to the Google Cloud.

## Steps for setting up the initial envrionment
0a. Google Cloud account at hand and created a project inside the GCP and now opened a shell.

0b. Optional Authorization `gcloud auth list`

Might come handy: `cloudshell edit filename` to edit a local file on the shell. 

### Initial step: Setting zone and creating cluster
1. `gcloud config set compute/region "europe-west4"`
2. `gcloud config set compute/zone "europe-west4-a"`
3. `gcloud container clusters create --machine-type=e2-medium --zone=europe-west4-a quiz-place-cluster`

Notice: we're using "europe-west4-a" as zone.
### Authenticate (optional)
1. Get authentication for the cluster: `gcloud container clusters get-credentials quiz-place-cluster --zone europe-west4-a`
### Retrieving repo locally
1. Go to: https://source.cloud.google.com/repos
2. "Add repository" On the top-right.
3. "Connect external repository"
4. Select current GCP-project and Github.
5. Select the Github-repo in the wizard etc.
6. Go back to https://source.cloud.google.com/repos and select the new repo.
7. Hit the button "Edit code" and trust whatever it says. The repo is now being cloned to the shell.
#### Setting up repo to edit.
The repo is now cloned to the shell under `~/cloudshell_open/"the repo name with username"`
1. `mv cloudshell_open/ repos`
2. `cd repos`
3. `mv "the repo name with username"/ quiz-place`
### Repositoriy setup for the images
https://cloud.google.com/artifact-registry/docs/repositories/create-repos
1. `gcloud services enable artifactregistry.googleapis.com`
2. Go to `https://console.cloud.google.com/artifacts`
3. Press the plus button.
4. Details:
    1. Name: `quiz-place-repository`
    2. Format: Docker
    3. Mode: Standard
    4. Region: europe-west4
    5. Encryption and Cleanup: Google-managed and default.
5. Hit this in the shell: `gcloud auth configure-docker europe-west4-docker.pkg.dev`

## Building and pushing images
### Find out versions of the apps in the helm charts:
Do this manually or via the links:
- [Backend, v6 currently](https://github.com/oletimmers/quiz-place/blob/master/helm/quiz-app-chart/charts/quizAPI/Chart.yaml)
- [Frontend, v8 currently](https://github.com/oletimmers/quiz-place/blob/master/helm/quiz-app-chart/charts/quizUI/Chart.yaml)


### Build the image:
Fromout the repo main folder:

```shell
    cd backend
    sudo docker build -t quiz-app:v6 .
    cd ../frontend
    sudo docker build -t quiz-ui:v8 .
    # to verify:
    docker images
```

### Tagging the images
Image name format:

`LOCATION-docker.pkg.dev/PROJECT-ID/REPOSITORY/IMAGE`

In our case:

`europe-west4-docker.pkg.dev/sc-group31/quiz-place-repository/IMAGE-NAME`

Tagging the docker images:
- Default format: `docker tag SOURCE-IMAGE LOCATION-docker.pkg.dev/PROJECT-ID/REPOSITORY/IMAGE:TAG`
- In our case: `docker tag SOURCE-IMAGE europe-west4-docker.pkg.dev/sc-group31/quiz-place-repository/IMAGE-NAME:vX`
- So for the backend: `docker tag quiz-app:v6 europe-west4-docker.pkg.dev/sc-group31/quiz-place-repository/quiz-app:v6`
- And for the frontend: `docker tag quiz-ui:v8 europe-west4-docker.pkg.dev/sc-group31/quiz-place-repository/quiz-ui:v8`

### Pushing the images:
- Backend: `docker push europe-west4-docker.pkg.dev/sc-group31/quiz-place-repository/quiz-app:v6`
- Frontend: `docker push europe-west4-docker.pkg.dev/sc-group31/quiz-place-repository/quiz-ui:v8`

## Creating storage
`gcloud compute disks create --size=10GB --zone=europe-west4-a gce-nfs-disk`

## Deployment via kubernetes
Check the `backend/backend_deployment/gpc-api-deployment.yaml` and `frontend/frontend_deployment/gpc-ui-deployment.yaml` whether they have the right images.

```shell
    # Define the namespace for the project
    kubectl apply -f quiz-app-namespace.yaml
    # Apply the YAML files inside backend_deployment
    cd backend/backend_deployment/certificate
    kubectl apply -f selfsigned-issuer.yaml
    kubectl apply -f self-signed-cluster-issuer.yaml
    kubectl apply -f root-ca.yaml
    kubectl apply -f ca-issuer.yaml
    # to backend_deployment folder
    cd .. 
    kubectl apply -f api-service.yaml
    kubectl apply -f api-ingress.yaml
    kubectl apply -f gpc-api-deployment.yaml
    # Apply the YAML files inside postgres
    cd ../postgres
    kubectl apply -f nfs-server.yaml
    kubectl apply -f nfs-service.yaml
    kubectl apply -f postgres-config.yaml
    kubectl apply -f gpc-postgres-storage.yaml
    kubectl apply -f gpc-postgres-deployment.yaml
    kubectl apply -f postgres-secret.yaml
    kubectl apply -f postgres-service.yaml
    # Apply the YAML files inside frontend_deployment (in the frontend folder)
    cd ../../frontend/frontend_deployment
    kubectl apply -f gpc-ui-deployment.yaml
    kubectl apply -f ui-ingress.yaml
    kubectl apply -f ui-service.yaml
```
### Connecting the UI to the API
You might now notice that everything deploys. However, the URL of the API inside the UI-environment is not set right yet.
Do this by:
1. Going to the Kubernetes Engine inside the Google Cloud UI.
2. => Workloads => quiz-api-deployment workload
3. Next quiz-api-service in the exposing services area there is the exposed IP for the API. Copy this IP.
4. Set this IP in the `frontend/src/environments/environment.ts` and `~/environment.prod.ts`.
5. Build the UI-image again.
6. Tag it with a new version nummer on the end.
7. Push the new image.
8. Equal the imagetag in the `gpc-ui-deployment.yaml`.
9. `kubectl apply -f gpc-ui-deployment.yaml`
