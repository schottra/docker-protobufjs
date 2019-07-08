FROM node:10-alpine

WORKDIR /code
COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json
COPY generate-protobuf.js /code/generate-protobuf.js
RUN npm install

RUN ./node_modules/.bin/pbjs; exit 0

ENTRYPOINT ["node", "/code/generate-protobuf.js"]
