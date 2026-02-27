# BrandFlow VPS Deployment (Docker + NGINX + Cloudflare)

This setup runs the website in a container on `brandflow-network` **without exposing container ports**.
NGINX handles public `80/443` and Cloudflare fronts traffic.

## 1) Pre-requisites

- Docker + Docker Compose plugin installed on VPS
- External Docker network exists:

```bash
docker network create brandflow-network || true
```

- Your reverse-proxy NGINX service/container is attached to `brandflow-network`

## 2) Deploy website container

From project root:

```bash
docker compose build --no-cache
docker compose up -d
```

Verify:

```bash
docker ps | grep brandflow-web
docker network inspect brandflow-network | grep brandflow-web
```

## 3) NGINX reverse-proxy config

Use this in your NGINX vhost (the NGINX instance that is already terminating SSL and serving Cloudflare traffic):

```nginx
server {
    listen 80;
    server_name brandflow.co.za www.brandflow.co.za;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name brandflow.co.za www.brandflow.co.za;

    # SSL certs handled in your existing host-layer NGINX setup.

    location / {
        proxy_pass http://brandflow-web:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

> If your NGINX runs directly on host (not in Docker), it cannot resolve Docker DNS names by default.
> In that case, run your reverse-proxy NGINX as a container on `brandflow-network`, or use an alternate routing strategy.

## 4) Cloudflare settings

- SSL mode: **Full (strict)**
- Cache purge after deployment (if stale assets appear)
- Development mode optional while validating updates

## 5) Update workflow

```bash
git pull
docker compose build --no-cache
docker compose up -d
```

For hard cache busting in urgent cases, append a version query in `index.html` stylesheet/script URLs.
