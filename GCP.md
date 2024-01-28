# Google Cloud Platform installation
Steps took to deploy the quiz-place application to the Google Cloud.

## Steps
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

