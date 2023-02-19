# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /MASK
COPY . .
RUN npm install
RUN npm install pm2 -g
CMD ["pm2-runtime", ""]
EXPOSE 6969
