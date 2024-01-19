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
14) to go into the container: `kubectl exec -it <pod-name> --namespace=<namespace-name> -- /bin/sh`
to restart a deployment: `kubectl rollout restart deployment <deployment-name>`

to delete a deployment: `kubectl delete deployment <deployment-name>`  
then: `kubectl apply -f api-deployment.yaml` to create deployment again

### STEPS FOR DEPLOYING
`sudo docker build .`  
check the newly built image: `sudo docker images`  
from the output, copy image ID  
`sudo docker tag <image-id> localhost:32000/quiz-app:latest`  
try the image: `sudo docker run -p 5000:5000 localhost:32000/quiz-app:latest`

push image to the microk8s registry:  
check the status of microk8s: `microk8s status`  
start if it's not running: `microk8s start`  
check if registry addon is enabled, if not: `microk8s enable registry`  
push image to the registry: `sudo docker push localhost:32000/quiz-app:latest`       
finally, delete the pods in the current deployment with the command `kubectl delete pods --selector=app=quiz-api --namespace=quiz-app`  
after this, if you have created the deployment then it should hopefully be working  
### TO VIEW THE DEPLOYED DATABASE
`psql -h localhost -U postgres --password -p 30001 postgres`  
the password is: postgres
