# Use official node image as the base image
FROM node:20.11.0 as build
# Set the working directory
WORKDIR /frontend
# Copy the package*.json file inside the container so it can tell npm what packages to install
COPY package*.json ./

# Run the installation of all the packages required in package*.json
RUN npm install

RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points

# Copy the source code of the application into the /app folder of the container
COPY . .

RUN npm run build

# Stage 2, create a container with nginx
# that serves the files created in the previous build
FROM nginx:stable
# We copy the files that were created in the previous build to the folder where nginx expects them
COPY --from=build /frontend/dist/quiz-place/ /usr/share/nginx/html
EXPOSE 80
# # We copy the nginx configuration file form the host to the nginx installation
# COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf