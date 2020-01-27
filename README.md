# build-raven-os-org

An interface for to upload build manifests and schedule packages compilations.

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

### Test

Run unit tests and integration tests and generate code coverage:

```bash
$ ./test.sh
```

See code coverage:

```bash
$ firefox server/coverage/lcov-report/index.html
```

Run e2e tests:

```bash
$ ./dev.sh
$ cd front
$ npx cypress open
```

### Documentation

```bash
$ npm run apidoc --prefix server/
$ npm run jsdoc --prefix server/

$ firefox server/docs/apidoc/index.html server/docs/jsdoc/index.html
```
