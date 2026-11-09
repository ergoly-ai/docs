// Short page titles for the API reference. control writes each operation's
// summary as a full sentence ("Create a Worker and start provisioning it");
// the docs want a verb and a noun. Run after regenerating openapi.json:
//
//   bun scripts/apply-titles.ts
//
// Every operation must have a title here, and every title must match an
// operation, so a change to the API shows up as a failure rather than a
// long title slipping back in.
import titles from "./titles.json"

const path = new URL("../openapi.json", import.meta.url).pathname
const spec = await Bun.file(path).json()
const seen = new Set<string>()
for (const [route, ops] of Object.entries(spec.paths as Record<string, Record<string, { summary?: string }>>)) {
  for (const [method, op] of Object.entries(ops)) {
    if (!["get", "post", "put", "patch", "delete"].includes(method)) continue
    const key = `${method.toUpperCase()} ${route}`
    const title = (titles as Record<string, string>)[key]
    if (!title) throw new Error(`no title for ${key}: add it to scripts/titles.json`)
    op.summary = title
    seen.add(key)
  }
}
const stale = Object.keys(titles).filter((k) => !seen.has(k))
if (stale.length) throw new Error(`titles for operations the spec no longer has: ${stale.join(", ")}`)
await Bun.write(path, JSON.stringify(spec, null, 2) + "\n")
console.log(`titled ${seen.size} operations`)
