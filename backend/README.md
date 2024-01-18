### USEFUL COMMANDS
1) `kubectl get pods`
2) `kubectl get events`
3) `kubectl logs <pod-name>` or `kubectl logs <pod-name> -c <container-name>` to see the logs for a specific container
4) `kubectl get svc`
5) `kubectl apply -f <name-of-file>` after making changes on a yaml file
6) `kubectl get pv` (persistent volume information)
7) `kubectl get pvc` (persistent volume claim information)
8) `kubectl describe pod <pod-name>`

to delete a deployment: `kubectl delete deployment <deployment-name>`  
then: `kubectl apply -f api-deployment.yaml` to create deployment again
### STEPS FOR DEPLOYING
`sudo docker build .`  
check the newly built image: `sudo docker images`  
from the output, copy image ID  
`sudo docker tag <image-id> quiz-app:v1` (make sure to bump the version up each time you rebuild)  
try the image: `sudo docker run -p 5000:5000 quiz-app:v1`

push image to the microk8s registry:  
check the status of microk8s: `microk8s status`  
start if it's not running: `microk8s start`  
check if registry addon is enabled, if not: `microk8s enable registry`  
push image to the registry: `sudo docker push localhost:32000/quiz-app:v1` (or the current version)  
after this, if you have created the deployment then it should hopefully be working (not the case right now)
