# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Create a directory to store your application inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install your application's dependencies
RUN npm install

# Copy the rest of your application's source code to the working directory
COPY . .

# Expose the port that your application will run on
EXPOSE 8080

# Define the command to run your application
CMD ["node", "server.js"]