FROM node:22.14.0
WORKDIR /home/node

COPY package*.json .
RUN npm install
COPY . .

CMD ["/bin/bash", "entrypoint.sh"]
ENV TZ America/Toronto