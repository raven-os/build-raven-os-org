## Getting Started

### Installing

Install dependencies

```bash
$ npm install
```
### Run

#### Development

```bash
$ npm start
```

#### Docker

Bind the docker daemon's socket to the builder so it can run an nbuild container.
Note that it needs two volumes: one for the manifests and the built packages. It also needs to be a tty and an access to the internet.

```sh
docker run -v /var/run/docker.sock:/var/run/docker.sock -v nbuild_manifests:/home/node/builder/manifests/ -v nbuild_out:/home/node/builder/out/ --net=host -t tmp/builder
```
