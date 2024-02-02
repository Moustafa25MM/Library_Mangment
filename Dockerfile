# Use the official Node.js 18 image as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install any dependencies
RUN npm install 

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build your code for production (if you have TypeScript or Babel, etc.)
RUN npm run build

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 4000

# Run the specified command within the container.
CMD [ "npm" ,"run" , "db:push", "&&" , "node", "dist/index.js" ]