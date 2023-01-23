# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /MASK
COPY . .
RUN npm install
CMD ["npm", "start", "prod"]
EXPOSE 6969