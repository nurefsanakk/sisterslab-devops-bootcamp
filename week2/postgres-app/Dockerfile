FROM node:21

WORKDIR /postgre_app

COPY package*.json ./

RUN npm install

COPY . /postgre_app

CMD ["npm", "start"]