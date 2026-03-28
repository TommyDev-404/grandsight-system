# Use Node.js 20
FROM node:20

# Set working directory inside container
WORKDIR /src

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all other files
COPY . .

# Expose port used by React dev server
EXPOSE 3000

# Start React dev server
CMD ["npm", "run", "dev"]