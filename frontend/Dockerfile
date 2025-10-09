FROM node:22.14.0
WORKDIR /home/node

COPY package*.json .
RUN npm install
COPY . .

CMD npm run dev
ENV TZ America/Toronto