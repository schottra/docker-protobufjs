# docker-protobufjs
A docker container image for generating code with [protobuf.js](https://github.com/dcodeIO/protobuf.js).

This project was inspired by [docker-protoc](https://github.com/namely/docker-protoc) and mimics its behavior in some ways.

# Basic Usage
The primary use case is generating JS and TS files via the protobufjs command line tools (`pbjs` / `pbts`). Nearly all arguments that can be passed to those tools can also be passed to the container and will be forwarded accordingly.

Files will be generated to `/gen`. Alternate input/output directories may be implemented in the future. But for now, you'll have to suffer through a copy/move step if you want them somewhere else ;-).

The only two hard requirements are:
* You must mount your root protobuf directory to the `/defs` volume in the docker container.
* You must specify a `--module-name` parameter when running the container. This is used to name the output files genereated by protobufjs. (see example below)

## Basic example
The following command:

```sh
docker run -v `pwd`:/defs schottra/docker-protobufjs:latest --module-name mymodule -d protos -- -t static-module -w es6
```

will process all `.proto` files in ./protos (non-recursively) and bundle them as a static es6 module into `/gen/pb-js/mymodule.js`.
It will also generate Typescript definitions into `/gen/pb-js/mymodule.d.ts`.

**_Note:_** All arguments placed after the `--` will be forwarded to `pbjs`. This gives you complete control over the behavior of the output so that you can tailor it to your needs. Please see the pbjs [command line reference](https://github.com/dcodeIO/protobuf.js#command-line) for more information on the available flags.


## More examples
Process multiple directories (`protos/core` and `protos/client`) using a shared root include path (`/defs/protos`).

```sh
docker run -v `pwd`:/defs schottra/docker-protobufjs:latest --module-name mymodule -d protos/core -d protos/client -- -t static-module -w es6 -p /defs/protos
```

Using some advanced `pbjs` options to trim out unnecessary functionality and set a root protobuf namespace name:

```sh
docker run -v `pwd`:/defs schottra/docker-protobufjs:latest --module-name mymodule -d protos/core -d protos/client -- --root mymodule -t static-module -w es6 --no-delimited --force-long --no-convert
```

# Options
The following options control the behavior of the container:
```
    -d, --dir       Specifies one or more directories to search for .proto files. Alternatively, you can
                    pass individual file names directly to pbjs by placing them at the end of the argument
                    list after the `--`.

    --module-name   Determines the file names to be used in the output JS and TS files.
```
