FROM node:alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install -g pnpm
RUN npm install -g turbo
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Environment variables must be redefined at run time

ENV DATABASE_TYPE=postgresql
ARG DATABASE_URL=postgres://postgres.xmeeqdwniitxlnofonbc:scW28VJy3aO1Olco@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres

ENV DATABASE_URL=${DATABASE_URL}
ARG NEXT_PUBLIC_DEPLOY_MODE=SELF_HOSTED

RUN turbo run build --filter=@penx/db
RUN turbo build --filter=web...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.mjs .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

ARG NEXTAUTH_SECRET=adb6e96b7ec73026c7562eff5f8b95ee
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

ENV DATABASE_TYPE=postgresql
ARG DATABASE_URL=postgres://postgres.xmeeqdwniitxlnofonbc:scW28VJy3aO1Olco@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres

ENV DATABASE_URL=${DATABASE_URL}
ARG NEXT_PUBLIC_DEPLOY_MODE=SELF_HOSTED

ENV NEXT_PUBLIC_DEPLOY_MODE=${NEXT_PUBLIC_DEPLOY_MODE}

ARG SELF_HOSTED_USERNAME=penx
ENV SELF_HOSTED_USERNAME=${SELF_HOSTED_USERNAME}

ARG SELF_HOSTED_PASSWORD=123456
ENV SELF_HOSTED_PASSWORD=${SELF_HOSTED_PASSWORD}

CMD node apps/web/server.js