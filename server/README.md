## Getting Started

### Prerequisites

Install **[Postgresql](https://www.postgresql.org/)** and **[RabbitMQ](https://www.rabbitmq.com/)**

## Installation

```bash
$ npm install
```

## Run

```bash
$ npm start
```

## Migrations

##### Create a migration file

`$ npm run migrate:make migration_name`

##### Run latest migration

`$ npm run migrate:latest`

##### Rollback previous migration

`$ npm run migration::rollback`
