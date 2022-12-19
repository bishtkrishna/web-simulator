#############
### build ###
#############

# base image
FROM node:16 as build

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --legacy-peer-deps
RUN npm install -g --save-dev @angular/cli@11.0.5
COPY jquery-3.5.1.min.js ./node_modules/bootstrap/dist/js/

# add app
COPY . /app

# generate build
RUN ng build --output-path=dist

############
### prod ###
############

# base image
FROM nginx:1.21.6-alpine

COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# copy artifact build from the 'build environment'
COPY --from=build /app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
