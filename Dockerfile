FROM node:alpine
WORKDIR /app
EXPOSE 3000
COPY . .
RUN yarn
CMD ["yarn", "start:dev"]