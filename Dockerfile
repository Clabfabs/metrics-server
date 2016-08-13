FROM node:slim

ADD . /metrics-server
RUN cd /metrics-server; npm install

WORKDIR /metrics-server

EXPOSE 3000

CMD ["npm", "start"]
