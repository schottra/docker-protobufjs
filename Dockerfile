FROM node:10-alpine

RUN npm install -g yarn@1.9

RUN set -ex && apk --update --no-cache add git

WORKDIR /code
COPY package.json /code/package.json
COPY yarn.lock /code/yarn.lock
COPY generate-protobuf.js /code/generate-protobuf.js

WORKDIR /code
RUN yarn

RUN mkdir -p /usr/local/include/flyteproto
RUN git clone https://github.com/lyft/flyteproto.git /usr/local/include/flyteproto/

ENTRYPOINT ["node", "/code/generate-protobuf.js"]
