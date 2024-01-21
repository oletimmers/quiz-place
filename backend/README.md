## IF INGRESS IS NOT ENABLED: microk8s enable ingress
1) get ingress pod name: `microk8s kubectl get pods -n ingress`
2) view ingress logs: `microk8s kubectl logs -n ingress <ingress-controller-pod-name>`  
3) to delete ingress: `kubectl get ingress -n quiz-app` to see ingress names and `kubectl delete ingress <ingress-name> -n quiz-app` 

### ingress related stuff
1) check status of ingress resource: `microk8s kubectl get ingress -n quiz-app`
2) to test inside a cluster: `microk8s kubectl run -i --tty --rm debug --image=alpine --namespace=quiz-app -- sh`
3) inside the pod from number (2): apply `apk add --no-cache curl` and `curl http://api.quiz-app.com` to test

### USEFUL COMMANDS
1) `kubectl get pods`
2) `kubectl get events`
3) `kubectl logs <pod-name>` or `kubectl logs <pod-name> -c <container-name>` to see the logs for a specific container
4) `kubectl get svc` or `kubectl get services` or `kubectl get service <service-name>` or `kubectl get service <service-name> -o wide`
5) `kubectl apply -f <name-of-file>` after making changes on a yaml file
6) `kubectl get pv` (persistent volume information)
7) `kubectl get pvc` (persistent volume claim information)
8) `kubectl describe pod <pod-name>`
9) to see the descriptor of the the deployment in yaml format: `kubectl get deployment <deployment-name> -o yaml`
10) `kubectl get endpoints`
11) to get deployments in a specific namespace: `kubectl get deployments -n quiz-app`
12) get pods in a namespace: `kubectl get pod -n quiz-app`
13) get logs of a pod in a namespace: `kubectl logs <pod-name> -n quiz-app`
14) to go into the container and check the files etc.: `kubectl exec -it <pod-name> --namespace=quiz-app -- /bin/sh`  
15) to restart a deployment: `kubectl rollout restart deployment <deployment-name>`

to delete a deployment: `kubectl delete deployment <deployment-name>`  
then: `kubectl apply -f api-deployment.yaml` to create deployment again

### STEPS FOR DEPLOYING
`sudo docker build .`  
check the newly built image: `sudo docker images`  
from the output, copy image ID  
`sudo docker tag <image-id> localhost:32000/quiz-app:latest`  
try the image: `sudo docker run -p 5000:5000 localhost:32000/quiz-app:latest` (not necessary)  

push image to the microk8s registry:  
check the status of microk8s: `microk8s status`  
start if it's not running: `microk8s start`  
check if registry addon is enabled, if not: `microk8s enable registry`  
push image to the registry: `sudo docker push localhost:32000/quiz-app:latest`       
finally, delete the pods in the current deployment with the command `kubectl delete pods --selector=app=quiz-api --namespace=quiz-app` (after deletion, the pods will be recreated with the newly built image)    
after this, if you have created the deployment then it should hopefully be working  
### TO VIEW THE DEPLOYED DATABASE
`psql -h localhost -U postgres --password -p 30001 postgres`  
the password is: postgres
