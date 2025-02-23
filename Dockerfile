# Use an official Node.js runtime as the base image
FROM node:22.14.0-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install the dependencies inside the container
RUN npm install

# Copy the entire source code to the container
COPY . .

# Install TypeScript  & Concurrently globally inside the container
RUN npm install -g typescript

RUN npm install concurrently

# Compile TypeScript to JavaScript
RUN tsc

# Expose the port the app runs on (default for Express is 3000)
EXPOSE 3000

# Command to run the app when the container starts
CMD ["npm", "run", "dev"]
