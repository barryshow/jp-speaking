import { useEffect, useMemo, useRef, useState } from 'react'
import { SECTIONS, GROUPS, STATS } from './data/index.js'
import TopicCard from './components/TopicCard.jsx'

const PART_FILTERS = [
  { id: 'all', label: '全部' },
  { id: '1', label: 'Part 1' },
  { id: '2', label: 'Part 2 & 3' },
]

function haystack(t) {
  const parts = [t.titleJa, t.titleZh, t.titleEn]
  if (t.cue) parts.push(t.cue.ja, t.cue.zh, t.cue.en)
  for (const list of [t.questions, t.bullets, t.part3]) {
    if (list) for (const x of list) parts.push(x.ja, x.zh, x.en)
  }
  return parts.join(' ').toLowerCase()
}

export default function App() {
  const [query, setQuery] = useState('')
  const [part, setPart] = useState('all')
  const [showZh, setShowZh] = useState(true)
  const [showEn, setShowEn] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [activeId, setActiveId] = useState(SECTIONS[0].id)
  const mainRef = useRef(null)

  const q = query.trim().toLowerCase()

  const filtered = useMemo(
    () =>
      SECTIONS.map((s) => ({
        ...s,
        topics: s.topics.filter((t) => {
          if (part !== 'all' && String(t.part) !== part) return false
          if (q && !haystack(t).includes(q)) return false
          return true
        }),
      })).filter((s) => s.topics.length > 0),
    [q, part],
  )

  const shownCount = filtered.reduce((n, s) => n + s.topics.length, 0)

  // 滚动到当前分区，高亮侧栏
  useEffect(() => {
    const targets = filtered
      .map((s) => document.getElementById(`sec-${s.id}`))
      .filter(Boolean)
    if (!targets.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id.replace('sec-', ''))
      },
      { rootMargin: '-120px 0px -70% 0px', threshold: 0 },
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [filtered])

  const goTo = (id) => {
    setNavOpen(false)
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-inner">
          <p className="kicker">日本語スピーキング練習帳</p>
          <h1>
            日语口语题库
            <span className="hero-sub">Japanese Speaking Topics</span>
          </h1>
          <p className="lede">
            以雅思口语题库为蓝本，全部题目改写为自然的日语。Part 1 短问答、Part 2 提示卡、Part 3
            深入讨论，共 <strong>{STATS.total}</strong> 个话题。
          </p>
          <div className="stats">
            <div className="stat">
              <b>{STATS.part1}</b>
              <span>Part 1</span>
            </div>
            <div className="stat">
              <b>{STATS.part2}</b>
              <span>Part 2 &amp; 3</span>
            </div>
            <div className="stat">
              <b>{STATS.questions}</b>
              <span>题目总数</span>
            </div>
          </div>
        </div>
      </header>

      <div className="shell">
        <nav className={`sidebar ${navOpen ? 'is-open' : ''}`} aria-label="目录">
          <button className="nav-close" onClick={() => setNavOpen(false)} aria-label="关闭目录">
            ×
          </button>
          <p className="nav-title">目次</p>
          <ul className="nav-list">
            {SECTIONS.map((s) => {
              const count = s.topics.length
              return (
                <li key={s.id}>
                  <button
                    className={activeId === s.id ? 'active' : ''}
                    onClick={() => goTo(s.id)}
                  >
                    <span>{s.labelZh}</span>
                    <em>{count}</em>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="nav-legend">
            <p>Part 1 — 4 問の短い質疑</p>
            <p>Part 2 — 1 分準備・2 分スピーチ</p>
            <p>Part 3 — 3 問の深掘り</p>
          </div>
        </nav>

        <main className="main" ref={mainRef}>
          <div className="toolbar">
            <button className="nav-open" onClick={() => setNavOpen(true)}>
              目次
            </button>
            <label className="search">
              <span className="search-icon" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="検索 / 搜索：旅行・education・history…"
                aria-label="搜索话题"
              />
            </label>
            <div className="chips" role="group" aria-label="筛选题目类型">
              {PART_FILTERS.map((f) => (
                <button
                  key={f.id}
                  className={`chip ${part === f.id ? 'on' : ''}`}
                  onClick={() => setPart(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="chips" role="group" aria-label="显示语言">
              <button
                className={`chip ${showZh ? 'on' : ''}`}
                onClick={() => setShowZh((v) => !v)}
              >
                中文
              </button>
              <button
                className={`chip ${showEn ? 'on' : ''}`}
                onClick={() => setShowEn((v) => !v)}
              >
                English
              </button>
            </div>
          </div>

          {shownCount === 0 && (
            <p className="empty">
              「{query}」に一致する話題はありません。
              <button onClick={() => { setQuery(''); setPart('all') }}>条件をリセット</button>
            </p>
          )}

          {filtered.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              showZh={showZh}
              showEn={showEn}
            />
          ))}

          <footer className="foot">
            <p>
              題材：IELTS Speaking 題庫（2026年9–12月）→ 日本語版に改編。日本語訳は学習用に書き起こしたものです。
            </p>
            <p>
              練習のコツ：Part 1 は 2〜3 文で即答、Part 2 は「いつ・どこ・誰・何・どう感じた」の順で組み立て、Part 3
              は理由と具体例を一つ添える。
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}

function SectionBlock({ section, showZh, showEn }) {
  // 按 group 分组，保持原页「人物类 / 地点类 / 事物类 / 事件类」的顺序
  const groups = useMemo(() => {
    const order = ['part1', 'people', 'place', 'thing', 'event']
    const map = new Map()
    for (const t of section.topics) {
      if (!map.has(t.group)) map.set(t.group, [])
      map.get(t.group).push(t)
    }
    return order.filter((g) => map.has(g)).map((g) => ({ id: g, topics: map.get(g) }))
  }, [section])

  return (
    <section id={`sec-${section.id}`} className="section">
      <h2 className="section-title">
        {section.labelZh}
        {section.note && <span className="section-note">{section.note}</span>}
        <span className="section-count">{section.topics.length}</span>
      </h2>
      {groups.map((g) => (
        <div key={g.id} className="group">
          <h3 className="group-title">
            {GROUPS[g.id].label}
            <span>{GROUPS[g.id].en}</span>
          </h3>
          <div className="cards">
            {g.topics.map((t) => (
              <TopicCard key={t.id} topic={t} showZh={showZh} showEn={showEn} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
