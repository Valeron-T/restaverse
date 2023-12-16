# Use Node 18 environment
FROM node:18-slim
# Set the working directory
WORKDIR /user/src/app
# Copy dependency list and install
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
# Copy all files 
COPY . .
# Allow inbound connections to port 80
EXPOSE 80
# Build the react client
RUN npm run build
# Run the client
CMD [ "npm","run","preview","--","--host","0.0.0.0", "--port", "3000" ]