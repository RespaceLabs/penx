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


## Deploy your own

Deploy a dynamic blog using Cloudflare Pages, D1, R2, and AI.

There two way to deploy PenX:
- Deploy with PenX One-click tools (recommended). [Deploy now ](https://penx.io/self-hosted)
- Deploy with source code. [Deploy now ](https://www.0xz.io/posts/f39ff8fe-3db8-4dd9-90d3-352c289546c5)

## Local development

To develop PenX locally, follow these steps:

1.Clone the repository:

```
git clone https://github.com/penx-labs/penx
```

2.Initial setup: run the following commands for the first time:

```bash
pnpm install
pnpm run db:generate
pnpm run db:migrate:prod
```

3.Start local server:

```bash
pnpm dev
```

Your local server will be available at `http://localhost:3000`

4.Preview local database:

```bash
pnpm run db:studio:local
```

## Examples blogs

Explore these example blogs created with PenX:

- https://www.0xz.io
- https://penx-blog.pages.dev

## ⚖️ License

This project is open-source and contributions are welcome. Join the community to help enhance PenX for writers everywhere.

For any issues or suggestions, please visit our [GitHub Issues page](https://github.com/penx-labs/penx/issues).