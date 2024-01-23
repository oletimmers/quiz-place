# Software Containerization at the VU Amsterdam - Group 31 - the quiz-place application

This repository is created for the Software Containerisation (XM_0091) Project by Group 31 consisting of: 
Efe Beydoğan, Ole Timmers and Laura Duits. 

The repository is split into two parts: the frontend and the backend. The backend comprises both a REST API
and a postgres database, while the frontend uses Angular for the application.

The different components included in this project are:
- A Deployment, Service, Persistent Volume and Persistent Volume Claim.
- The Service is exposed by the database so it can be accessed by the REST API (but not by users outside of the cluster).
- The configuration of the database uses ConfigMaps and Secrets.

## Deployment 

In order to deploy the application, you should download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
and [MicroK8s](https://canvas.vu.nl/courses/71162/pages/install-microk8s?module_item_id=1201441). 
Ensure that you have opened Docker Desktop before continuing.

<details>
    <summary>Required additional steps for Windows and macOS users</summary>
        Do note that on Windows and macOS the MicroK8s installer employs **multipass** to create a VM within which MicroK8s operates. 
        Therefore, it is not possible to use `localhost:32000` to deploy the application. Instead, you should update the address 
        in the following files to the IP address of the VM that deploys the MicroK8s:
        
        - `frontend/src/environments/environment.prod.ts`
        - `frontend/src/environments/environment.ts`
        - `frontend/frontend_deployment/ui-deployment.yaml` 
        - `backend/backend_deployment/api-deployment.yaml`
        
        To find the IP address, run `multipass list` to get all available VM instances and their IP addresses.
        Additionally, to avoid deployment issues, you also have to include the IP address in the `"insecure-registries"` of the Docker Engine.
        In order to deploy the application, replace all the occurrences of `localhost` in the commands with the found IP address.

</details>

In order to access the web application, you should first add `<IP address> api.quiz-app.com` and `<IP address> quiz-app.com`
to `/etc/hosts` (e.g. `127.0.0.1 app.quiz-app.com` for Linux users).

**Before continuing, ensure that MicroK8s is running using `microk8s status` or `microk8s start` to start MicroK8s. 
Additionally, run `microk8s disable ingress` and `microk8s enable registry`.**
Also run `microk8s enable metallb` and then supply `10.50.100.5-10.50.100.25`

Run the following commands to create the Secret used for the application:

1) Generate a self-signed certificate: `openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes`
2) Create a TLS Secret: `kubectl create secret tls my-tls-secret --cert=cert.pem --key=key.pem`
3) Enable ingress using the created Secret: `microk8s enable ingress:default-ssl-certificate=default/my-tls-secret`

To get the ingress pod name, run `microk8s kubectl get pods -n ingress` and to view the ingress logs `microk8s kubectl logs 
-n ingress <ingress-controller-pod-name>`

4) `kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.yaml`
5) `microk8s enable cert-manager`

In order to examine the resources created by cert-manager, you can run `kubectl get all -n cert-manager` and 
`kubectl get apiservice`.

6) Build the Docker Image for the backend by navigating to the `backend` folder and running `sudo docker build .`
7) Check the newly built image using `sudo docker images` and use the image-id to tag the image with the correct IP address: 
`sudo docker tag <image-id> localhost:32000/quiz-app:latest`.
8) Push the image to the MicroK8s registry: `sudo docker push localhost:32000/quiz-app:latest`
9) Apply the YAML files by running the following commands:

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
    kubectl apply -f api-deployment.yaml
    # Apply the YAML files inside postgres
    cd ../postgres
    kubectl apply -f postgres-config.yaml
    kubectl apply -f postgres-deployment.yaml
    kubectl apply -f postgres-secret.yaml
    kubectl apply -f postgres-service.yaml
    kubectl apply -f postgres-storage.yaml
    # Apply the YAML files inside frontend_deployment (in the frontend folder)
    cd ../../frontend/frontend_deployment
    kubectl apply -f ui-deployment.yaml
    kubectl apply -f ui-ingress.yaml
    kubectl apply -f ui-service.yaml
    ```

To test the configured frontend ingress with the certificates, you can run `microk8s kubectl get secret myingress-cert -n quiz-app -o yaml` and
`kubectl get Certificate -n quiz-app -o wide`. Additionally, to verify the TLS connection with openssl run `openssl s_client -showcerts -connect quiz-app.com:443`
and `openssl s_client -showcerts -connect api.quiz-app.com:443`.

10) Delete the pods in the current deployment using `kubectl delete pods --selector=app=quiz-api --namespace=quiz-app` to 
make sure they are updated in case changes have been made (after deletion, the pods will be recreated with the newly built image).

To see the created pods, run `kubectl get pod -n quiz-app`. There should be seven pods: three for the ui, three for the api and one for postgres.

11) Build the Docker Image for the frontend by navigating to the `frontend` folder and running `sudo docker build -t quiz-ui:latest .`.
12) Make sure to tag the image with the appropriate IP address: `sudo docker tag quiz-ui:latest localhost:32000/quiz-ui:latest`.
13) Push the image to the MicroK8s registry: `sudo docker push localhost:32000/quiz-ui:latest`
14) Delete the pods in the current deployment with the command `kubectl delete pods --selector=app=quiz-ui --namespace=quiz-app`
15) Try adding a user to the database ` curl -H 'Content-Type: application/json' -d '{ "username":"john","role":"admin" }' -X POST https://api.quiz-app.com/create-user`

### Certificate not trusted by browser
Once you open up your browser, Chrome will scream that the url is not safe etc. (quiz-app.com)
Also the UI won't connect with the api. To fix this, manually insert the link of the api into your browser and hit enter, accept the risks, bla-bla-bla, and then reload the main UI. Reason why this works: https://stackoverflow.com/questions/53642092/angular-https-call-to-self-signed-uri-failing-with-neterr-cert-authority-inva
