# packages-raven-os-org

This is Raven-OS's package manager interface.

It's based on Rocket.

## Getting Started

These instructions will get your own copy Raven-OS's package manager interface up and running on your local machine for development and testing purposes.

See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Use a nightly version of rust
```bash
$ rustup default nightly
```

Install `diesel_cli` a tool that handle database operations
```bash
$ cargo install diesel_cli --no-default-features --features mysql
```

For Raven'OS's website to work, you will need to set some environment variables. You can add them by hand or put them in a `.env` file.

```bash
$ echo DATABASE_URL=mysql://username:password@localhost/db_name > .env
```

### Installing

Setup the database

```bash
$ diesel setup
$ diesel migration run
```

### Front

[Front documentation](front/README.md)

### Configuration

You can have a look at [Rocket's documentation](https://rocket.rs/guide/configuration/#rockettoml) to see how to configure a `Rocket.toml`. Default settings should be find for debugging purposes tho'

### Run

```bash
$ cargo run
```

You can tweak the default ip/port with some environment variables (More informations [here](https://rocket.rs/guide/configuration/#rockettoml):

```bash
$ ROCKET_ADDRESS=127.0.0.1 ROCKET_PORT=80 cargo run
```

You may need `sudo` if you want to listen on port `80`.
