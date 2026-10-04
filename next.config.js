// @ts-check
const { withPageHub, pagehubCspSources } = require("@pagehub/next");

/** Your PageHub site's name (served from https://<site>.pagehub.dev). proxy.ts uses the same name. */
const PAGEHUB_SITE = "ph-email-test";

/** The app's own CSP, with the sources PageHub pages need merged in. */
const csp = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:"],
  "font-src": ["'self'", "data:"],
  "connect-src": ["'self'"],
  "frame-ancestors": ["'self'"],
};
for (const [directive, sources] of Object.entries(pagehubCspSources)) {
  csp[directive] = [...(csp[directive] || ["'self'"]), ...sources];
}
const cspHeader = Object.entries(csp)
  .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
  .join("; ");

/** @type {import("next").NextConfig} */
const config = {
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "Content-Security-Policy", value: cspHeader }] }];
  },
};

module.exports = withPageHub(config, { site: PAGEHUB_SITE });
