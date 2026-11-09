> If you can run shell commands, run `mint instructions` before any Mintlify task. It prints current guidance for this CLI version. Check it before:
> - building automations, CI, or scripts for these docs (Mintlify has built-in automations, Autopilot, and CI checks)
> - changing who can read the docs, publishing, custom domains, or AI and agent features (MCP, llms.txt, skill.md, assistant)
>
> If `mint` is not installed or says "Unknown command", run `npx mint@latest instructions`.
> The CLI needs Node 20.17 or newer; `.tool-versions` pins Node 22 for asdf.

# Ergoly docs

The public documentation and changelog for Ergoly, served at https://docs.ergoly.ai. Built on [Mintlify](https://mintlify.com): pages are MDX files with YAML frontmatter, configuration lives in `docs.json`, a push to `main` deploys.

The pages were moved here from the website (growth/website-ergoly, `src/lib/docs/` and `src/lib/changelog.ts`) on 2026-11-08. This repo is now the only source; the website only redirects.

## Who reads this

The person who runs an agency on Ergoly. Write for them, in the words the control app uses. Engineers reading the API get the Technical details section, where internal words are defined once.

## Terminology

- **Worker**, never "AI teammate", "agent" or "bot". A worker is an AI member of the company.
- **Company**, never "organization" or "org", except once in the glossary as the API's name for it.
- **Client**: a customer of the agency. Acme and Globex are the example clients.
- **AI Admin**: the built-in worker that sets things up. Ada in examples.
- The cast of the examples: Nora (worker), Ada (AI Admin), Sam (you), Priya (teammate), Daniel at Acme, Mei at Globex.
- **control** (lower case, no article) is the web app at control.ergoly.ai.
- Internal names (organization, gateway, runtime, event, turn) appear only under Technical details.

## Style

- Second person, present tense, one idea per sentence.
- The reader's situation before the mechanism: what they want to do, then how.
- Sentence case for headings. Headings carry an explicit id: `## Placing and moving {#place}`. Keep ids stable; they are the anchors other pages and the website link to.
- Bold for UI elements: press **Create client**. Code formatting for paths, commands and file names.
- Callouts: `<Note>**Worth knowing.** …</Note>` for the thing that surprises people. `<Warning>**Coming soon.** …</Warning>` at the top of a page about a feature that has not shipped, with `tag: "SOON"` in the frontmatter.
- Related pages as cards: `<Columns cols={2}><Card title href>hint</Card></Columns>`.
- A Slack conversation uses the `SlackScene` snippet: `import { SlackScene } from "/snippets/SlackScene.jsx"`, then `<SlackScene scene={{ channel, kind, lines: [{ from, name, text }] }} channels={[…]} caption="…" />`. `from` is one of `you`, `worker`, `team`, `client`. Names in `snippets/SlackScene.jsx`'s PORTRAITS list get a face from `/images/people`.
- Diagrams are static SVGs under `/images/diagrams`, placed in a `<Frame caption>`.

## Changelog

One page per entry, so each release has a link of its own, plus the index at `/changelog` which shows every entry with filters and an RSS feed.

Entries are written by hand from the matching file in the kb repo (`kb/product/changelog/<id>.md`), and only from one marked `visibility: public`. The kb entry's "Internal" section never comes here. `<id>` is `YYYY-MM-DD-slug`, the kb filename without `.md`, and is the permalink: once live, it does not change.

To add an entry:

1. Write the body in `snippets/changelog/<id>.mdx`: the opening paragraph, then `## Feature title` and a paragraph per feature, then `## Improvements` and `## Fixes` as bullet lists of `**Title.** body`. No frontmatter, no H1.
2. Create `changelog/<id>.mdx` with frontmatter `title`, `sidebarTitle` (the date, "November 2, 2026"), `description` (one or two sentences), an import of the snippet, the date in italics, and the imported component.
3. Add an `<Update>` block at the top of `changelog.mdx`, newest first: `label` is the date, `description` the title, `tags` the sections the entry has (Features, Improvements, Fixes), `rss` the title, description and date. Inside: the imported component and a `[Link to this entry](/changelog/<id>)` line.
4. Add `changelog/<id>` to the Changelog group in `docs.json`, right after `changelog`.

Copy an existing entry to get the shape right.

## API reference

The **API** tab is generated from `openapi.json` at the repo root. Its navigation in `docs.json` lists every operation by hand as `METHOD /path`, grouped by the concept a reader has in mind (Company, Workers, Clients, Channels, Tasks, Webhooks, Connections) rather than by the spec's tags, with sub-groups where one resource covers several ideas (Provisioning, Copies, Memory; Channel mappings; Scheduled jobs; Hosts, Connected apps, MCP servers, Provider apps, Your own OAuth client). A new operation goes into the group that fits, not at the end. The only hand-written page is `api-reference/introduction.mdx`; everything else comes from the spec, so never write endpoint pages by hand.

The spec is not hand-kept either. control builds it from its operation list (`product/control/src/lib/platform-api/docs/document.ts`), and the live API serves the same document at `/api/v1/openapi.json` behind a key. To refresh it, from `product/control` on an up-to-date `main`:

```bash
bun -e 'import { buildOpenApiDocument } from "@/lib/platform-api/docs/document"; await Bun.write("../../docs/openapi.json", JSON.stringify(buildOpenApiDocument("https://control.ergoly.ai"), null, 2) + "\n")'
```

Then run `bun scripts/apply-titles.ts` from this repo: it replaces each operation's summary with the short page title in `scripts/titles.json` (a verb and a noun, "Create a worker", never a sentence that lists what else the call does) and fails if an operation has no title or a title has no operation. Then, if an operation was added or removed, update the matching group in `docs.json` (a listed endpoint that is gone fails `mint validate`; a new one is invisible until listed), run `mint validate`, and commit. Refresh it whenever a control release changes the API; the changelog entry for that release is the cue. The `auth` and `errors` tags have no operations; their prose lives on the introduction page.

## Content boundaries

- Do not invent product facts. If a page needs a fact that is not in control, the kb repo or an existing page, leave a `{/* TODO: … */}` comment and say so.
- Nothing internal: no roadmap, no customer names, no numbers from the business.
- The API documents itself at https://control.ergoly.ai/api/v1; the Technical details pages describe it but do not duplicate the reference.

## Checks

```bash
mint validate
mint broken-links --check-anchors --check-redirects
mint dev --no-open
```
