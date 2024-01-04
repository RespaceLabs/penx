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
ARG NEXTAUTH_SECRET=adb6e96b7ec73026c7562eff5f8b95ee
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG DATABASE_URL=postgresql://postgres:iix4wPiQmWYV7a4m@db.wnvtegeovcmeqcwuheee.supabase.co:5432/postgres
ENV DATABASE_URL=${DATABASE_URL}
ARG REDIS_URL=redis://default:PenX_local_123456@43.154.135.183:6381
ENV REDIS_URL=${REDIS_URL}
ARG NEXT_PUBLIC_DEPLOY_MODE=SELF_HOSTED
ENV NEXT_PUBLIC_DEPLOY_MODE=${NEXT_PUBLIC_DEPLOY_MODE}
ARG SELF_HOSTED_CREDENTIALS=penx/123456
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
ARG NEXTAUTH_SECRET=adb6e96b7ec73026c7562eff5f8b95ee
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG DATABASE_URL=postgresql://postgres:iix4wPiQmWYV7a4m@db.wnvtegeovcmeqcwuheee.supabase.co:5432/postgres
ENV DATABASE_URL=${DATABASE_URL}
ARG REDIS_URL=redis://default:PenX_local_123456@43.154.135.183:6381
ENV REDIS_URL=${REDIS_URL}
ARG NEXT_PUBLIC_DEPLOY_MODE=SELF_HOSTED
ENV NEXT_PUBLIC_DEPLOY_MODE=${NEXT_PUBLIC_DEPLOY_MODE}
ARG SELF_HOSTED_CREDENTIALS=penx/123456
ENV SELF_HOSTED_CREDENTIALS=${SELF_HOSTED_CREDENTIALS}

CMD node apps/web/server.js
