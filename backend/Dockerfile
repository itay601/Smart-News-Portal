# Step 1: Build the React application
FROM node:18-alpine AS build

# Set the working directory in the container
WORKDIR /backend

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies (use --production to exclude devDependencies)
RUN npm ci --production

# Copy the entire project directory to the working directory
COPY . .

# Expose port 8000 for the development server
EXPOSE 8000

# Command to start the development server
CMD ["node", "src/index.js"]
