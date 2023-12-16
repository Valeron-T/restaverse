FROM node:18-slim
WORKDIR /user/src/app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY . .
EXPOSE 80
RUN npm run build
CMD [ "npm","run","preview","--","--host","0.0.0.0", "--port", "3000" ]