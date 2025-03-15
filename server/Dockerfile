ARG VERSION=20-alpine

FROM node:$VERSION

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

COPY . .

EXPOSE 5000

# CMD ["npm", "run", "startindocker"]

# CMD ["npm", "start"]

CMD npm run dbinit && npm start
