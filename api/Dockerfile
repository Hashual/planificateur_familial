FROM node:20-alpine

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY package*.json .

RUN npm install --silent
RUN npm install --silent --only=dev

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]