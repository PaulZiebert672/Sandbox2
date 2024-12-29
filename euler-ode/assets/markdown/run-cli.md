## Run CLI commands

### Calculate orbit data

Edit configuration file `conf/config.json`

#### Node.js

```shell
node cli-orbit.js
```

#### Docker

```shell
docker run -it --rm --name node -v ${PWD}:/home/node -w /home/node node:latest \
    node cli-orbit.js
```

### Filter data to table

Covert data to _tabular separated value_ (TSV) table

#### awk

```shell
node cli-orbit.js |
    bin/${PROBLEM_ID}/filter-orbit.awk
```

#### Node.js

```shell
node cli-orbit.js |
    node bin/${PROBLEM_ID}/filter-node.js
```

#### Docker

```shell
docker run -it --rm --name node -v ${PWD}:/home/node -w /home/node node:latest \
    sh -c "node cli-orbit.js |
        node bin/${PROBLEM_ID}/filter-orbit.js"
```
