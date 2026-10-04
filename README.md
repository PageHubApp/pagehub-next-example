# PageHub + Next.js example

A Next.js app that serves a PageHub site at its root with [`@pagehub/next`](https://pagehub.dev).

- `/signin` is the app's own page (`pages/signin.tsx`). The app serves it.
- Every other path, including `/`, is served by the PageHub site. There's no `pages/index.tsx`.
- The site's forms, analytics and chat call `/_pagehub/*` on the app's domain, and PageHub sees each visitor's real IP.
- Canonical URLs and `/sitemap.xml` point at the app's domain, not `pagehub.dev`.

Edit the site in PageHub and publish. The change shows up on the app's domain within about a minute, with no app deploy.

## Files that matter

| File | What it does |
|---|---|
| [`next.config.js`](next.config.js) | Wraps the config with `withPageHub`, and merges `pagehubCspSources` into the app's own Content-Security-Policy |
| [`proxy.ts`](proxy.ts) | Hands `/_pagehub/*` to PageHub with the visitor's IP attached (`pagehubMiddleware`) |
| [`pages/signin.tsx`](pages/signin.tsx) | An app page, to show the app's routes still win |

## Set it up for your own site

1. **In PageHub, turn on static publishing** for the site and publish it (MCP: `publish_site({ static: true })`).
2. **Set the mount origin** to your app's origin, for example `https://example.com` (MCP: `update_site({ mountOrigin: "https://example.com" })`). The reply includes a mount key that starts with `phmk_`. You'll need it in step 5. To replace it later, run `update_site({ rotateMountKey: true })`.
3. **Install the package:** `pnpm add @pagehub/next`.
4. **Point the app at your site:** change `PAGEHUB_SITE` in `next.config.js` and `site` in `proxy.ts` to your site's name.
5. **Add the mount key to your app's environment** as `PAGEHUB_MOUNT_KEY`. On Vercel: `vercel env add PAGEHUB_MOUNT_KEY production`. Keep it out of git. Without it the site still works, but PageHub sees every visitor as your server, so form rate limits and analytics lump everyone together.

Then delete any app page you've rebuilt in PageHub, and PageHub serves that path from then on.

## Run it

```sh
pnpm install
PAGEHUB_MOUNT_KEY=phmk_... pnpm dev
```

Open http://localhost:3000 for the PageHub site and http://localhost:3000/signin for the app's page.

## About the vendored package

`@pagehub/next` isn't on npm yet, so this repo installs it from `vendor/pagehub-next-0.1.0.tgz`. Once it's published, switch to the npm version:

```sh
pnpm add @pagehub/next
rm -r vendor
```

## Limits

- The PageHub site must be static-published.
- It mounts at the root only, not under a sub-path like `/site/*`.
- A page is either a PageHub page or an app page, never both.

## License

MIT
