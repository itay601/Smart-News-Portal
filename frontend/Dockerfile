# Step 1: Build the React application
FROM node:18-alpine AS build

# Set the working directory in the container
WORKDIR /frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project directory to the working directory
COPY . .

# Set the HOST environment variable so the server binds to 0.0.0.0
ENV HOST=0.0.0.0

# Expose port 3000 for the development server
EXPOSE 3000

# Command to start the development server
CMD ["npm", "start"]
