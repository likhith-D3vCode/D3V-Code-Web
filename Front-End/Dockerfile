FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --no-optional

RUN npm uninstall @rollup/rollup-linux-x64-musl || true


# Copy the application code
COPY . .

# Expose the frontend port
EXPOSE 80

# Run the application
CMD ["npm", "run","dev", "--","--host"]
