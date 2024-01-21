# STEPS THAT WERE FOLLOWED TO ENABLE HTTPS
DO THIS:  
`sudo nano /etc/hosts`  
add the following lines to the end of the file and save:  
`127.0.0.1 api.quiz-app.com` and `127.0.0.1 quiz-app.com`  

## the steps below are the steps i took to configure https for the ui, you should probably just apply each yaml file and verify the tls connection with the command given in the final step (follow the steps above first)  
1) `openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes`
2) `kubectl create secret tls my-tls-secret --cert=cert.pem --key=key.pem`
3) `microk8s disable ingress`
4) `kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.yaml`
5) `microk8s enable cert-manager`
6) examine resources created by cert-manager: `kubectl get all -n cert-manager` and `kubectl get apiservice`
7) create a selfsigned-issuer.yaml file and configure it 
8) apply with `kubectl apply -f selfsigned-issuer.yaml`
9) create `self-signed-cluster-issuer.yaml` and apply with `kubectl apply -f self-signed-cluster-issuer.yaml`
10) create `root-ca.yaml` and apply with `kubectl apply -f root-ca.yaml`
11) create `ca-issuer.yaml` and apply with `kubectl apply -f ca-issuer.yaml`
12) configured frontend ingress with the certificates
13) test: `microk8s kubectl get secret myingress-cert -n quiz-app -o yaml` and `kubectl get Certificate -n quiz-app -o wide`
14) verify tls connection with openssl: `openssl s_client -showcerts -connect quiz-app.com:443`