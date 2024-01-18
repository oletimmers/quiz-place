## Follow these steps to run the app
BEFORE YOU BUILD THE IMAGES:  
open your command prompt and issue the command `hostname -I`
from there, copy the first IP address in the output  
go to frontend/src/environments  
inside this directory there are two files, in each of them replace API_BASE_URL with "http://the-ip-address:4000" (for example: http://192.168.0.104:4000)  
I unfortunately couldn't find a workaround to this that would allow us to skip this procedure  

1) `docker compose build`
2) `docker compose up -d`
3) to see the logs: `docker compose logs -f` OR `docker compose logs CONTAINER_NAME -f` (for example: docker compose logs quiz_app -f)

### To visualize the database:
1) download TablePlus: https://tableplus.com/download
2) select PostgreSQL as the database
3) Database host: localhost, port: 5432, user: postgres, password: postgres, database name: postgres
4) you should be able to connect after filling all of the fields as stated above

### To run migrations (update the database after changes are made):
1) go inside the container: `docker compose exec quiz_app bash` and run the following commands
2) `flask db stamp head`
3) `flask db migrate`
4) `flask db upgrade`
5) you can exit the container by supplying `exit` on the command line

### Other commands of use:
1) `docker compose up -d flask_db`
2) `docker compose build`
3) `docker compose up flask_app`

### Docker file of backend
Within the docker file of the backend the hostname "flask_db" is defined for the database, this hostname however will 
probably not exist on the kubernetes deployment of the postgres database. To still connect the api with the database.
find out the ip of the pod running the postgres database. Find out by `kubectl desribe pod <podname>`
