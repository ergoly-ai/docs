/* A Slack conversation, held still: the whole exchange on the page at once, so
   a reader following steps sees it in one look. Ported from the website's
   SlackFrame (growth/website-ergoly/src/components/product/sections.tsx) with
   the replay removed and the colours written out, since the docs site has no
   access to the website's CSS variables.

   Props:
     scene    { channel, kind: "channel" | "dm", lines: [{ from, name, text, badge?, card? }] }
     channels the channel names the sidebar lists
     caption  one line under the frame

   Faces: a name in PORTRAITS has a picture under /images/people; a worker
   without one gets the brand's petal avatar; a person gets an initial. */

const INK = "#282828"
const MUTED = "#636666"
const FAINT = "#8e9192"
const PAPER = "#ffffff"
const GREY_LIGHT = "#f2f3f3"
const GREY_DARK = "#282828"
const RULE = "rgba(40,40,40,0.13)"
const SLACK = { sidebar: "#3F0E40", sidebarActive: "#1164A3", sidebarText: "rgba(255,255,255,0.72)", rule: "rgba(0,0,0,0.09)" }
const HUES = ["#f456a9", "#00c5c5", "#ff9100", "#947bff", "#3576d9", "#ffba31", "#ff4931"]
const PORTRAITS = ["nora", "daniel", "milo", "frida", "sam", "lena", "mia", "marie", "tom", "jo", "ava", "raj", "kim", "priya", "you"]

const seedFor = (name) => name.toLowerCase().replace(/[^a-z]/g, "")
const portraitKey = (name) => name.split(/[\s·]/)[0].toLowerCase().replace(/[^a-z]/g, "")

function hash(seed) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967296
}

function Petal({ seed, size, radius }) {
  const a = hash(seed)
  const b = hash(`${seed}#p`)
  const bg = HUES[Math.floor(a * HUES.length)]
  const turn = Math.floor(b * 4)
  const half = b > 0.55
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <rect width="24" height="24" rx={radius} fill={bg} />
      <g transform={`rotate(${turn * 90} 12 12)`}>
        {half ? <path d="M2,12 A10,10 0 0 1 22,12 Z" fill="#fff" fillOpacity={0.92} /> : <path d="M12,2 A10,10 0 0 1 22,12 L12,12 Z" fill="#fff" fillOpacity={0.92} />}
      </g>
    </svg>
  )
}

function Face({ line, size = 30 }) {
  const key = portraitKey(line.name)
  if (PORTRAITS.includes(key)) {
    return (
      <span style={{ width: size, height: size, borderRadius: 8, flexShrink: 0, overflow: "hidden", display: "block" }}>
        <img src={`/images/people/${key}.webp`} alt="" width={size} height={size} style={{ width: size, height: size, objectFit: "cover", display: "block", margin: 0 }} />
      </span>
    )
  }
  if (line.from === "worker") return <Petal seed={seedFor(line.name)} size={size} radius={8} />
  const you = line.from === "you"
  const team = line.from === "team"
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        background: you ? GREY_DARK : team ? "#cabdff" : "#98bbed",
        color: you ? GREY_LIGHT : team ? "#3b3554" : "#23334b",
        fontWeight: 900,
        fontSize: "0.72rem",
      }}
    >
      {line.name.charAt(0)}
    </span>
  )
}

function FileIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  )
}
function LinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8" />
    </svg>
  )
}

function CardBlock({ card }) {
  const kind = card.kind || "list"
  if (kind === "file" || kind === "link") {
    return (
      <div style={{ marginTop: 8, display: "inline-flex", gap: 10, alignItems: "center", border: `1px solid ${RULE}`, borderRadius: 10, padding: "8px 12px", background: PAPER }}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: kind === "file" ? "#ffdd98" : "#c0f2f1", display: "grid", placeItems: "center", color: INK }}>
          {kind === "file" ? <FileIcon /> : <LinkIcon />}
        </span>
        <span>
          <span style={{ display: "block", fontWeight: 900, fontSize: "0.8rem", color: kind === "link" ? "#164746" : INK, textDecoration: kind === "link" ? "underline" : "none", textUnderlineOffset: 3 }}>
            {card.title}
          </span>
          {card.lines.map((l) => (
            <span key={l} style={{ display: "block", fontSize: "0.74rem", color: MUTED }}>
              {l}
            </span>
          ))}
        </span>
      </div>
    )
  }
  return (
    <div style={{ marginTop: 8, borderLeft: "3px solid #00c5c5", background: GREY_LIGHT, borderRadius: "0 8px 8px 0", padding: "10px 12px" }}>
      <p style={{ fontWeight: 900, fontSize: "0.8rem", margin: "0 0 5px", color: INK }}>{card.title}</p>
      <ul style={{ display: "flex", flexDirection: "column", gap: 3, margin: 0, padding: 0, listStyle: "none" }}>
        {card.lines.map((l) => (
          <li key={l} style={{ fontSize: "0.79rem", color: MUTED, lineHeight: 1.45, margin: 0 }}>
            · {l}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Message({ line, time }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "10px 0" }}>
      <Face line={line} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 900, fontSize: "0.86rem", color: INK, letterSpacing: "-0.01em" }}>{line.name}</span>
          {line.from === "worker" && (
            <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", padding: "1px 4px", borderRadius: 3, background: "rgba(0,0,0,0.07)", color: MUTED }}>APP</span>
          )}
          {line.badge && (
            <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: "#ffdd98", color: "#564421" }}>⏰ {line.badge}</span>
          )}
          <span style={{ fontSize: "0.68rem", color: FAINT }}>{time}</span>
        </div>
        <p style={{ fontSize: "0.88rem", lineHeight: 1.55, color: INK, fontWeight: 500, margin: 0 }}>{line.text}</p>
        {line.card && <CardBlock card={line.card} />}
      </div>
    </div>
  )
}

function times(n) {
  const out = []
  let m = 9 * 60 + 14
  for (let i = 0; i < n; i++) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`)
    m += 1 + (i % 3) * 2
  }
  return out
}

export const SlackScene = ({ scene, channels = [], caption }) => {
  const dm = scene.kind === "dm"
  const stamps = times(scene.lines.length)
  const workerNames = Array.from(new Set(scene.lines.filter((l) => l.from === "worker").map((l) => l.name)))
  const Dot = ({ color }) => <span style={{ width: 10, height: 10, borderRadius: 9999, background: color, display: "block" }} />
  const label = { fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", padding: "0 6px 8px", margin: 0 }

  return (
    <figure style={{ margin: "1.5rem 0" }}>
      <div style={{ borderRadius: "1rem", overflow: "hidden", border: `1px solid ${RULE}`, background: PAPER, boxShadow: "0 24px 60px -34px rgba(40,40,40,0.4)", color: INK }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: SLACK.sidebar }}>
          <Dot color="#FF5F57" />
          <Dot color="#FEBC2E" />
          <Dot color="#28C840" />
          <span style={{ marginLeft: 10, color: "rgba(255,255,255,0.8)", fontSize: "0.76rem", fontWeight: 700 }}>Your agency</span>
        </div>
        <div style={{ display: "flex", minHeight: 320 }}>
          <div className="hidden sm:block" style={{ width: 150, flexShrink: 0, background: SLACK.sidebar, padding: "14px 10px" }}>
            <p style={label}>Channels</p>
            {channels.map((c) => {
              const active = !dm && c === scene.channel
              return (
                <div
                  key={c}
                  style={{ padding: "5px 6px", borderRadius: 5, fontSize: "0.78rem", color: active ? "#fff" : SLACK.sidebarText, background: active ? SLACK.sidebarActive : "transparent", fontWeight: active ? 700 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  # {c}
                </div>
              )
            })}
            <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "12px 6px" }} />
            <p style={label}>Workers</p>
            {workerNames.map((w) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 7, padding: "3px 6px", borderRadius: 5, background: dm && w === scene.channel ? SLACK.sidebarActive : "transparent" }}>
                <Petal seed={seedFor(w)} size={16} radius={4} />
                <span style={{ color: "#fff", fontSize: "0.78rem", fontWeight: 700 }}>{w}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "11px 16px", borderBottom: `1px solid ${SLACK.rule}`, fontWeight: 900, fontSize: "0.86rem", letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 8 }}>
              {dm ? (
                <>
                  <Petal seed={seedFor(scene.channel)} size={18} radius={5} /> {scene.channel}
                </>
              ) : (
                <># {scene.channel}</>
              )}
            </div>
            <div style={{ flex: 1, padding: "8px 16px 16px" }}>
              {scene.lines.map((l, i) => (
                <Message key={i} line={l} time={stamps[i]} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {caption && <figcaption style={{ marginTop: 12, fontSize: "0.8rem", color: FAINT }}>{caption}</figcaption>}
    </figure>
  )
}
