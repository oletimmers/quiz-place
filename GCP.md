# Google Cloud Platform installation
Steps took to deploy the quiz-place application to the Google Cloud.

## Steps for setting up the initial envrionment
0a. Google Cloud account at hand and created a project inside the GCP and now opened a shell.

0b. Optional Authorization `gcloud auth list`

### Initial step: Setting zone and creating cluster
1. `gcloud config set compute/region "europe-west4"`
2. `gcloud config set compute/zone "europe-west4-a"`
3. `gcloud container clusters create --machine-type=e2-medium --zone=europe-west4-a quiz-place-cluster`
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

## Building images
### Find out versions of the apps in the helm charts:
Do this manually or via the links:
- [Backend, v6 currently](https://github.com/oletimmers/quiz-place/blob/master/helm/quiz-app-chart/charts/quizAPI/Chart.yaml)
- [Frontend, v8 currently](https://github.com/oletimmers/quiz-place/blob/master/helm/quiz-app-chart/charts/quizUI/Chart.yaml)


### Build the image:
Fromout the repo main folder:

    cd backend
    sudo docker build -t quiz-app:v6 .
    cd ../frontend
    sudo docker build -t quiz-ui:v8 .
    # to verify:
    docker images


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
