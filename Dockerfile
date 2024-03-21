# Add lockfile and package.json's of isolated subworkspace
FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
WORKDIR /app

RUN npm install -g pnpm
RUN npm install -g turbo

COPY . .

# Environment variables must be redefined at run time
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV DATABASE_URL=${DATABASE_URL}
ENV REDIS_URL=${REDIS_URL}
ENV NEXT_PUBLIC_DEPLOY_MODE=${NEXT_PUBLIC_DEPLOY_MODE}
ENV SELF_HOSTED_CREDENTIALS=${SELF_HOSTED_CREDENTIALS}

# First install the dependencies (as they change less often)
RUN pnpm install

RUN npx turbo run build --filter=web...


FROM node:alpine AS runner
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

# Environment variables must be redefined at run time
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV DATABASE_URL=${DATABASE_URL}
ENV REDIS_URL=${REDIS_URL}
ENV NEXT_PUBLIC_DEPLOY_MODE=${NEXT_PUBLIC_DEPLOY_MODE}
ENV SELF_HOSTED_CREDENTIALS=${SELF_HOSTED_CREDENTIALS}


CMD node apps/web/server.js
