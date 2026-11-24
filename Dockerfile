# syntax=docker/dockerfile:1.7
# ---- deps -------------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- dev (vite with HMR; source is bind-mounted by compose) -----------
FROM deps AS dev
ENV CHOKIDAR_USEPOLLING=1
EXPOSE 8080
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]

# ---- build ------------------------------------------------------------
FROM deps AS build
ARG VITE_API_MODE=mock
ARG VITE_API_URL=
ENV VITE_API_MODE=$VITE_API_MODE VITE_API_URL=$VITE_API_URL
COPY . .
RUN npm run build

# ---- prod (static files behind nginx) ---------------------------------
FROM nginx:1.27-alpine AS prod
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/healthz || exit 1
