# Ergoly docs

The public documentation and changelog for Ergoly, at https://docs.ergoly.ai. Built with [Mintlify](https://mintlify.com).

- Pages are MDX files; the file path is the URL (`workers/identity.mdx` → `/workers/identity`).
- `docs.json` holds the site name, colours, fonts, navigation and redirects.
- `snippets/` holds the `SlackScene` component and the changelog entry bodies. Files there never render as pages.
- `images/` holds the diagrams and the portraits the Slack scenes use.

Writing and terminology rules are in [AGENTS.md](AGENTS.md).

## Working locally

Needs Node 20.17 or newer (`.tool-versions` pins 22 for asdf) and the Mintlify CLI:

```bash
npm i -g mint
mint dev            # preview at http://localhost:3000
mint validate       # schema and MDX errors
mint broken-links --check-anchors --check-redirects
```

## Publishing

A push to `main` deploys through the Mintlify GitHub app. The site is served at the Mintlify subdomain and at docs.ergoly.ai.
