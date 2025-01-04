# PenX

<div align="center">

<a href="https://www.penx.io" alt="PenX Logo">
    <img src="https://www.penx.io/images/logo-512.png" height="120"/></a>

<h1 style="border-bottom: none">
    <b>PenX</b><br />
    Next generation blogging tools
    <br>
</h1>

[Discord](https://discord.gg/nyVpH9njDu) | [Website](https://www.penx.io) | [Issues](https://github.com/penx-lab/penx/issues)

</div>

## Introduction

Deploy a dynamic blog using Cloudflare Pages, D1, R2, and AI.

## Getting Started

### Local Development


```bash
# Clone the repository
git clone https://github.com/penx-labs/penx

# Install dependencies
pnpm install

# Setup database
pnpm run db:generate
pnpm run db:migrate:local

# Start development server
pnpm run dev
```

Your local instance will be available at `http://localhost:3000`

### Deploy your own

To deploy PenX to Cloudflare, follow these steps:

#### 1. Clone the PenX Repository

First, clone the PenX project to your local machine by executing the following command:

```bash
git clone https://github.com/penx-labs/penx
```

#### 2. Configure `wrangler.toml`

Next, rename `wrangler.toml.example` to `wrangler.toml`.

#### 3. Create a Cloudflare D1 Database

Run the following command to create a Cloudflare D1 database:

```bash
npx wrangler d1 create penx-blog
```

If successful, you will see a confirmation message similar to this:

```
✅ Successfully created DB 'penx-blog' in region WNAM
Created your new D1 database.

[[d1_databases]]
binding = "DB"
database_name = "penx-blog"
database_id = "00e31c14-e6ae-4612-9bc3-d25c6a1f8023d"
```

Copy the `database_id` and update it in your `wrangler.toml` file.

#### 4. Create Cloudflare R2 Bucket

> Before create R2 Bucket, you need to bind a credit card to Cloudflare.

Create a Cloudflare R2 bucket by running:

```bash
npx wrangler r2 bucket create penx-bucket
```

You should receive a message confirming the creation of the bucket:

```
✅ Created bucket 'penx-bucket' with default storage class of Standard.

Configure your Worker to write objects to this bucket:

[[r2_buckets]]
bucket_name = "penx-bucket"
binding = "penx_bucket"
```

After r2 bucket created, update the `binding = "penx_bucket"` to `binding = "BUCKET"` in your `wrangler.toml` file.

#### 5. Create Cloudflare KV

Create a Cloudflare KV by running:

```bash
npx wrangler kv namespace create penx-kv
```

You should receive a message confirming the creation of the kv:

```
🌀 Creating namespace with title "penx-blog-penx-kv"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
[[kv_namespaces]]
binding = "penx_kv"
id = "4e0be465e99b4803a80107f78d6d2d70"
```

After kv namespace created, update your `wrangler.toml` file:
- Update the `binding = "penx_kv"` to `binding = "KV"`.
- Replace the `id = "<kv_id>"` with the generated kv namespace `id`.

#### 6. Configure Session Password

To set up a session password, visit [this link](https://generate-secret.vercel.app/64) to generate a secure password. Replace `SESSION_PASSWORD` in your `wrangler.toml` with this value.

#### 7. Deploy to Cloudflare Pages

Finally, deploy your blog by running these commands:

```bash
pnpm install
pnpm run db:generate # Required for initial release
pnpm run db:migrate:local
pnpm run deploy
```

Upon successful deployment, you will receive a URL like: https://penx-blog.pages.dev.

### Examples Blogs

- https://www.0xz.io
- https://penx-blog.pages.dev/

## ⚖️ License
