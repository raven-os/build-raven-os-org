## Getting Started

### Installing

The builder needs `nbuild` tool, so start by cloning `https://github.com/raven-os/nbuild` install its dependencies first then make a like to it

```bash
# clone from the builder folder if you don't already have it
$ git clone https://github.com/raven-os/nbuild

# If you already have nbuild, you can just mount it in another builder folder
$ mkdir nbuild
$ sudo mount --bind {path_to_nbuild} nbuild
```

Install dependencies

```bash
$ npm install
```
### Run

#### Development

```bash
$ npm start
```
