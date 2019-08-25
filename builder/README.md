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

Bind a docker daemon to the builder so he can run nbuild container,
it also needs two volumes, for manifests and packages and needs to be a tty

```sh
docker run -v /var/run/docker.sock:/var/run/docker.sock -v nbuild_manifests:/home/node/builder/manifests/ -v nbuild_out:/home/node/builder/out/ --net=host -t tmp/builder
```
