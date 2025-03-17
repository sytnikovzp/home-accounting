ARG VERSION=20-alpine

FROM node:$VERSION

RUN mkdir -p /app/server && mkdir -p /app/public/images/establishments && mkdir -p /app/public/images/users

WORKDIR /app/server

COPY package.json package-lock.json ./

RUN npm i

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
