# Elementary HTTP reverse proxy

### Configuration

Copy [`dotenv-sample`](dotenv-sample) to file `.env` and edit it.

| Name | Example | Description |
| ---- | ------- | ----------- |
| APP_PORT | 8080 | TCP port, optional, default=16221 |
| REQ_TARGET | http://localhost:16781 | URL to redirect all requests, required |

### Run service

```shell
node index
```

### Build docker image

```shell
docker build -t lab51trial/node-reverse-proxy:${tag} .
```

### Run docker container

Edit [docker-run.node-reverse-proxy.sh](docker-run.node-reverse-proxy.sh)

```shell
#!/usr/bin/env bash

docker run -it --rm \
  --name node-reverse-proxy \
  -e APP_PORT=8080 \
  -e REQ_TARGET=http://books.enceladus.saturn.local:8083 \
  -p 16221:8080 \
  -d lab51trial/node-reverse-proxy:M1
```

### Requirements

nodejs 18
