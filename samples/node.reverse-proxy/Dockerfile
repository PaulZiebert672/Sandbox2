FROM node:18 AS BUILD_IMAGE

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
#RUN npm set strict-ssl false
#RUN npm config set registry http://registry.npmjs.org/
RUN npm install

FROM node:18-alpine
WORKDIR /usr/src/app

# Bundle app source
COPY index.js .
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

EXPOSE 8080
CMD [ "node", "index.js" ]