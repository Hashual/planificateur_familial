FROM node:20-alpine

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY package.json .
COPY package-lock.json .

RUN npm install --silent -D

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]