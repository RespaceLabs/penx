<div align="center">

<a href="https://www.penx.io" alt="PenX Logo">
    <img src="https://www.penx.io/images/logo-512.png" height="120"/></a>

<h1 style="border-bottom: none">
    <b>PenX</b><br />
     A structured digital assets wallet for geeks
    <br>
</h1>

[Discord](https://discord.gg/nyVpH9njDu) | [Website](https://www.penx.io/) | [Issues](https://github.com/penxio/penx/issues)

</div>

## Introduction

An elegant App designed to help you capture, organize, and store your thoughts, tasks, ideas, and information.

## Features

- **Local-First** - You own your data, in spite of the cloud
- **Privacy-First** - Use End-To-End Encryption to sync data
- **Open Source** - Trust our code, not our words

## Primary tech stack

- Next.js
- TypeScript
- tRPC
- Prisma
- NextAuth.js
- Slate.js
- IndexedDB

## Development

After clone the repo, in the root dir:

```bash
# Install the dependencies
pnpm install

# copy .env.local.example to .env.local copy
copy apps/web/.env.local.example apps/web/.env.local

# start web service
pnpm dev
```

Go to: http://localhost:3000

## ⚖️ License

AGPL 3.0
