# build-raven-os-org
Work In Progress - Will be hosted at https://build.raven-os.org

`rustc 1.31.0-nightly (b2d6ea98b 2018-10-07)`

### Setup Postgres database and diesel

#### Installation

```bash
$ apt-get install postgres postgresql-contrib
$ update-rc.d postgresql enable
$ service postgresql start
$ apt-get install libpq-dev
# connect to postgres and set a password using \password
$ cargo install diesel_cli --no-default-features --features postgres --force

# set database url in .env
$ echo DATABASE_URL=postgres://username:password@localhost/db_name > .env

$ diesel setup
```

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
