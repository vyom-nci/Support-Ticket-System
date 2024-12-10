# Use Node.js as the base image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with --legacy-peer-deps to avoid peer dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the application code
COPY . .

# Expose the backend port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
