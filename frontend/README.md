# DEPLOYMENT INSTRUCTIONS

## deployment steps
1) `sudo docker build -t quiz-ui:latest .`
2) view the image: `sudo docker images quiz-ui` (not necessary)
3) MAY NOT BE NECESSARY: make sure to clean up the running container: run `sudo docker ps` to see running containers, if there are any use `sudo docker stop <container-id>`, then `sudo docker rm <container-id>`. finally run `sudo docker ps` again to see that there are no running containers (to run: `sudo docker run -p 8091:80 quiz-ui:latest` and go to `http://localhost:8091`)
4) make sure microk8s is running (`microk8s status`)
5) tag the image: `sudo docker tag quiz-ui:latest localhost:32000/quiz-ui:latest`
6) push the image: `sudo docker push localhost:32000/quiz-ui:latest`
7) delete pods with `kubectl delete pods --selector=app=quiz-ui --namespace=quiz-app` so they are recreated with the latest image (or create deployment inside `frontend_deployment` folder with `kubectl apply -f ui-deployment.yaml` if you have made changes to the yaml file)
8) check that the related pods are running with `kubectl get pods -l app=quiz-ui -n quiz-app`
9) IF CHANGED: apply the service inside `frontend-deployment`: `kubectl apply -f ui-service.yaml`
10) view the app by going to `localhost:30002` or `https://quiz-app.com`

# QuizPlace

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
