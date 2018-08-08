FROM node:10-alpine

RUN npm install -g yarn@1.9

WORKDIR /code
COPY package.json /code/package.json
COPY yarn.lock /code/yarn.lock
COPY generate-protobuf.js /code/generate-protobuf.js

WORKDIR /code
RUN yarn

ENTRYPOINT ["node", "/code/generate-protobuf.js"]
