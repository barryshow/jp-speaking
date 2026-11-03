import { useState } from 'react'

export default function TopicCard({ topic: t, showZh, showEn }) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    const url = `${location.origin}${location.pathname}#${t.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      /* 剪贴板不可用时静默失败 */
    }
  }

  return (
    <article className="card" id={t.id}>
      <header className="card-head">
        <h4>
          {t.titleJa}
          <button className="anchor" onClick={copyLink} title="リンクをコピー">
            {copied ? '✓' : '#'}
          </button>
        </h4>
        <div className="card-meta">
          <span className={`tag tag-${t.tag === '保留题' ? 'retained' : t.tag === '补充报告' ? 'extra' : t.tag === '高频核心' ? 'core' : 'new'}`}>
            {t.tag}
          </span>
          <span className="card-title-zh">{t.titleZh}</span>
        </div>
        {showEn && <p className="card-title-en">{t.titleEn}</p>}
      </header>

      {t.part === 1 ? (
        <ol className="qlist">
          {t.questions.map((q, i) => (
            <li key={i}>
              <span className="q-no">{i + 1}</span>
              <div className="q-body">
                <p className="q-ja">{q.ja}</p>
                {showZh && <p className="q-zh">{q.zh}</p>}
                {showEn && <p className="q-en">{q.en}</p>}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="p2">
          <div className="cue">
            <p className="cue-label">Part 2</p>
            <p className="q-ja">{t.cue.ja}</p>
            {showZh && <p className="q-zh">{t.cue.zh}</p>}
            {showEn && <p className="q-en">{t.cue.en}</p>}
            <p className="cue-hint">– You should say:</p>
            <ul className="bullets">
              {t.bullets.map((b, i) => (
                <li key={i}>
                  <span className="dot" aria-hidden="true" />
                  <div className="q-body">
                    <p className="q-ja">{b.ja}</p>
                    {showZh && <p className="q-zh">{b.zh}</p>}
                    {showEn && <p className="q-en">{b.en}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="p3">
            <p className="cue-label">Part 3</p>
            <ol className="qlist">
              {t.part3.map((q, i) => (
                <li key={i}>
                  <span className="q-no">{i + 1}</span>
                  <div className="q-body">
                    <p className="q-ja">{q.ja}</p>
                    {showZh && <p className="q-zh">{q.zh}</p>}
                    {showEn && <p className="q-en">{q.en}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </article>
  )
}
