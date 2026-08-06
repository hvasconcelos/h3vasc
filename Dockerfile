# syntax=docker/dockerfile:1

# ---------- build ----------
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies from the lockfile first so this layer is cached
# independently of source changes.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Astro inlines PUBLIC_* into the static output at build time, so these have to
# be present here rather than at `docker run` — passing them to the runtime
# container would be too late to reach the HTML. Both are optional: without an
# ID the analytics tag is simply not emitted.
ARG PUBLIC_UMAMI_WEBSITE_ID
ARG PUBLIC_UMAMI_SRC
ENV PUBLIC_UMAMI_WEBSITE_ID=$PUBLIC_UMAMI_WEBSITE_ID
ENV PUBLIC_UMAMI_SRC=$PUBLIC_UMAMI_SRC

RUN npm run build

# ---------- serve ----------
FROM nginx:1.29-alpine AS runtime

# The site is fully static, so nginx just serves dist/.
COPY --from=build /app/dist /usr/share/nginx/html

# The official image runs envsubst over /etc/nginx/templates at startup, which
# is what makes PORT overridable — hosts like Cloud Run or Fly inject their own.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --spider "http://127.0.0.1:${PORT}/" || exit 1

CMD ["nginx", "-g", "daemon off;"]
