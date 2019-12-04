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

If you want to access `nest-server` from your browser you must add `127.0.0.1 nest-server` in `/etc/hosts`

```bash
# Append the line at the end of /etc/hosts
$ echo "127.0.0.1 nest-server" | sudo tee -a /etc/hosts
```

### Production

```bash
$ ./deploy.sh
```
