# build-raven-os-org
Work In Progress - Will be hosted at https://build.raven-os.org

## Installation

```bash
$ apt-get install postgres postgresql-contrib
$ update-rc.d postgresql enable
$ service postgresql start
$ apt-get install libpq-dev
# connect to postgres and set a password using \password

# set your configuration in src/config.local.js
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


#### Connect to postgres

```bash
$ sudo su postgres
$ psql

\password # set a password
\l # list databases
\c db_name # connect to database
\dt # list tables
\q # quit
```
