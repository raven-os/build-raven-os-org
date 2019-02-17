# build-raven-os-org
Work In Progress - Will be hosted at https://build.raven-os.org
Temporary readme, to be updated

## Installation

```bash
$ apt-get install postgresql postgresql-contrib libpq-dev
# start postgres on boot
$ update-rc.d postgresql enable
$ service postgresql start
# Switch to the `postgres` user and start `psql`: `sudo -u postgres psql`, and then set a password using the `\password` command.
# Create the database `create database 'build-raven-os-org';`

# set your local configuration in src/config.local.js, example in src/config.js, only override the fields you want to change
$ npm i
$ npm run migrate:latest
$ npm start
```

#### Migrations

###### Create a migration file

`$ npm run migrate:make migration_name`

###### Run latest migration

`$ npm run migrate:latest`

###### Rollback previous migration

`$ npm run migration::rollback`

#### RabbitMQ
```bash
sudo apt-get install rabbitmq-server
sudo service rabbitmq-server start

# list queues
sudo rabbitmqctl list_queues
```

#### Migrations

###### Create a migration file

`$ npm run migrate:make migration_name`

###### Run latest migration

`$ npm run migrate:latest`

###### Rollback previous migration

`$ npm run migration::rollback`


#### Connect to postgres

```bash
$ sudo -u postgres psql

\password # set a password
\l # list databases
\c db_name # connect to database
\dt # list tables
\q # quit
```
