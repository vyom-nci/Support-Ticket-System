# Use Node.js as the base image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Build the application
RUN npm run build

# Serve the application using a lightweight server
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Expose the frontend port
EXPOSE 3000
