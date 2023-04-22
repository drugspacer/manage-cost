Instructions to run project
===========================

First af all you have to specify your token to currency exchange service
[https://openexchangerates.org/](https://openexchangerates.org/)

Replace **YOUR_TOKEN** in `./manage-cost-ui/src/constants/token.ts` with your token.

Run on local machine in standalone mode
---------------------------------------

Install postgres instance on your local machine and execute script for local database initialization.
Run in sql editor (pgadmin4):

    ./db/init-dev.sql

This code creates user with credentials **managecost:managecost** as a main user and gives all permissions to manage
**managecost** database.

Set certificates to jwt token. To perform this run:

    bash ./scripts/generate-jwt-keypair.sh

Run backend from project dir and frontend from **./manage-cost-ui** dir.

Run on local machine in docker
------------------------------

In this mode application builds project files into **jar** archive and then pushes image with your application into
docker registry. Then you can run application in containers in your local machine. You must have these requirements:

- Docker is installed on your local machine,
- You have account on [Docker Registry](https://hub.docker.com/)

> In this setup application uses a test environment. So you can modify **application-test.properties** file to add other functionality.

Create and fill **./docker/.env** file with sensitive data.

    POSTGRES_DB=your_db_name
    POSTGRES_USER=your_db_user
    POSTGRES_PASSWORD=your_db_password
    DOCKER_USERNAME=login_to_your_docker_account
    DOCKER_PASSWORD=password_to_your_docker_account

Then run build script, note you have to run docker on your machine to execute build.sh script because it uses docker
to build and push an image:

    bash ./scripts/build.sh

And deploy script to run docker-compose:

    bash ./scripts/deploy.sh

> More information about images and docjer you can find here:
> - [Docker](https://docs.docker.com/)
> - [Postgres image](https://hub.docker.com/_/postgres)
> - [Openjdk image](https://hub.docker.com/_/openjdk)

Installing on server
--------------------

This section helps to deploy your application in linux server and run docker compose. 
It doesn't cover nginx settings and manage your domain and ssl configuration.

As in the previous section you must have these requirements:

- Docker is installed on your local machine,
- Docker instance is running on your server,
- You have an account on [Docker Registry](https://hub.docker.com/)

Change **application-prod.properties** file. Change property **cost-count.hostname** to:

    cost-count.hostname=your_domain_name

Create and fill **./docker/.env** file with sensitive data.

    POSTGRES_DB=your_db_name
    POSTGRES_USER=your_db_user
    POSTGRES_PASSWORD=your_db_password
    DOCKER_USERNAME=login_to_your_docker_account
    DOCKER_PASSWORD=password_to_your_docker_account

Then run build script, note you have to run docker on your machine to execute build.sh script because it uses docker
to build and push an image:

    bash ./scripts/build.sh

Next step is copying your **docker-compose.yml** file with **.env** to the server and running deploy script. To do this:

1. Copy **docker-compose.yml** and **.env** from **./docker** folder to **./docker** folder on the server,
2. Copy **init.sql** from **./db** folder to **./db** folder on the server,
3. Copy **server-deploy.sh** from **./scripts** folder to your **$USER** dir on the server and make executable,

Run delpoy script

    bash ./server-deploy.sh

If all goes as expected the application should start.

> Port can be busy, by default containers use 8081 port for application and 5433 for postgres instance. 
> You can change them in **docker-compose.yml**
