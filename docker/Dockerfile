# syntax=docker/dockerfile:1
FROM node:16-alpine
RUN apk update && apk add git
RUN git clone https://github.com/mask-tech/MASK.git --depth 1 --single-branch --branch main MASK
WORKDIR /MASK
COPY src/admin-credentials.json src/credentials.json
RUN npm install
RUN npm install pm2 -g
CMD ["pm2-runtime", "docker/pm2.json"]
EXPOSE 6969
