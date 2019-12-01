# build-raven-os-org
Work In Progress - Will be hosted at https://build.raven-os.org
Temporary readme, to be updated

The project `build-raven-os-org` contains three main parts:

 - [The front](front/README.md)
 - [The server](server/README.md)
 - [The builder](builder/README.md)

## Docker

To configure the project, you can either `cp .env.example .env` and change the variables you want or define environment variables.

### Development

```bash
$ ./dev.sh
```

### Production

```bash
$ ./deploy.sh
```
