# Dockerfile
# preferred node version chosen here (LTS = 18.18 as of 10/10/23)
FROM node:18.18-alpine

# Update
RUN apk add --no-cache libc6-compat

RUN apk update

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
# RUN mv apps/web/.env.local.example apps/web/.env
RUN mv .env.self-hosted .env

# Install dependencies in /app
RUN pnpm install

RUN pnpm build:web

CMD pnpm start 
