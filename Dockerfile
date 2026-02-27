FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

# Remove default site content
RUN rm -rf /usr/share/nginx/html/*

# Copy static website files
COPY . /usr/share/nginx/html

# Custom nginx server config (container-internal only)
COPY docker/nginx/site.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
