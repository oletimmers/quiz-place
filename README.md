## Follow these steps to run the app
1) docker compose build
2) docker compose up -d
3) to see the logs: docker compose logs -f OR docker compose logs CONTAINER_NAME -f (for example: docker compose logs quiz_app -f)

### To visualize the database:
1) download TablePlus: https://tableplus.com/download
2) select PostgreSQL as the database
3) Database host: localhost, port: 5432, user: postgres, password: postgres, database name: postgres
4) you should be able to connect after filling all of the fields as stated above

### To run migrations (update the database after changes are made):
1) go inside the container: docker compose exec quiz_app bash and run the following commands
2) flask db migrate -m 'migration-message'
3) flask db upgrade
4) you can exit the container by supplying "exit" on the command line

### Other commands of use:
1) docker compose up -d flask_db
2) docker compose build
3) docker compose up flask_app