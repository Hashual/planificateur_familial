FROM node:20-alpine

RUN mkdir -p /usr/src/free-go
WORKDIR /usr/src/free-go

COPY package.json .
COPY package-lock.json .

RUN npm install --silent

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start"]