ARG VERSION=20-alpine

FROM node:$VERSION

RUN mkdir -p /app/client

WORKDIR /app/client

COPY package.json package-lock.json ./

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
