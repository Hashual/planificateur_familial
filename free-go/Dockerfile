FROM node:23-alpine

RUN mkdir -p /usr/src/free-go
WORKDIR /usr/src/free-go

COPY package.json .
COPY package-lock.json .

RUN npm install
RUN npm install --silent --only=dev

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start"]