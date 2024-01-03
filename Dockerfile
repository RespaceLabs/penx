# Dockerfile
# preferred node version chosen here (LTS = 18.18 as of 10/10/23)
FROM node:18.18-alpine

ENV NEXT_PUBLIC_DEPLOY_MODE SELF_HOSTED

# Update
RUN apk add --no-cache libc6-compat

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

# Install pnpm
RUN npm install -g pnpm
RUN npm install -g prisma

# Configure pnpm global
ENV PNPM_HOME=/pnpm-test/.pnpm
ENV PATH=$PATH:$PNPM_HOME

# Create the directory on the node image
# where our Next.js app will live
RUN mkdir -p /app

# Set /app as the working directory in container
WORKDIR /app

# Copy the code into /app
COPY . .

# Environment variables must be redefined at run time
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG REDIS_URL
ENV REDIS_URL=${REDIS_URL}
ARG NEXT_PUBLIC_DEPLOY_MODE
ENV NEXT_PUBLIC_DEPLOY_MODE=${NEXT_PUBLIC_DEPLOY_MODE}
ARG SELF_HOSTED_CREDENTIALS
ENV SELF_HOSTED_CREDENTIALS=${SELF_HOSTED_CREDENTIALS}

# Install dependencies in /app
RUN pnpm install

RUN pnpm build:web

CMD pnpm start 
