FROM node:latest


# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
COPY ./.env ./
RUN npm install


# Copy the application code
COPY . .

# Expose the backend port
EXPOSE 9000

# Run the application
CMD ["node", "index.js"]
