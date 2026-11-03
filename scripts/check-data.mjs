// 题库数据自检：node scripts/check-data.mjs
import { SECTIONS, STATS } from '../src/data/index.js'

const errors = []
const warnings = []
const seenIds = new Set()

// 简体中文专有字（不应出现在日语字段里）
const ZH_ONLY = /[们这那些说时个么对给过还让从为]/

function checkJa(field, value, where, { sentence = true } = {}) {
  if (!value || typeof value !== 'string') {
    errors.push(`${where}: ${field} 缺失`)
    return
  }
  const bad = value.match(ZH_ONLY)
  if (bad) warnings.push(`${where}: ${field} 含简体字「${bad[0]}」→ ${value}`)
  if (sentence && !/[。？]$/.test(value)) {
    warnings.push(`${where}: ${field} 结尾标点存疑 → ${value}`)
  }
}

// 数据文件里的 section 是语义标签，分区 id 会带 Part 2&3 的后缀
const SECTION_ALIAS = {
  new: ['new', 'new-p2'],
  retained: ['retained', 'retained-p2'],
  core: ['core'],
  extra: ['extra'],
}

for (const section of SECTIONS) {
  for (const t of section.topics) {
    const where = `${section.id}/${t.id}`
    if (seenIds.has(t.id)) errors.push(`${where}: id 重复`)
    seenIds.add(t.id)

    if (!SECTION_ALIAS[t.section]?.includes(section.id)) {
      errors.push(`${where}: section 字段「${t.section}」与分区「${section.id}」不符`)
    }
    checkJa('titleJa', t.titleJa, where, { sentence: false })

    if (t.part === 1) {
      if (!Array.isArray(t.questions) || t.questions.length !== 4) {
        errors.push(`${where}: Part 1 应有 4 个问题，实际 ${t.questions?.length}`)
      }
      t.questions?.forEach((q, i) => {
        checkJa('ja', q.ja, `${where}#q${i + 1}`)
        if (!q.zh) errors.push(`${where}#q${i + 1}: 缺中文`)
        if (!q.en) errors.push(`${where}#q${i + 1}: 缺英文`)
      })
    } else if (t.part === 2) {
      if (!t.cue) errors.push(`${where}: 缺 cue`)
      else checkJa('cue.ja', t.cue.ja, where)
      if (t.bullets?.length !== 4) errors.push(`${where}: cue point 应为 4 条`)
      if (t.part3?.length !== 3) errors.push(`${where}: Part 3 应为 3 题`)
      t.bullets?.forEach((b, i) => checkJa('ja', b.ja, `${where}#b${i + 1}`, { sentence: false }))
      t.part3?.forEach((q, i) => checkJa('ja', q.ja, `${where}#p3-${i + 1}`))
    } else {
      errors.push(`${where}: part 取值异常 ${t.part}`)
    }
  }
}

console.log(`话题：${STATS.total}（Part 1 ${STATS.part1} / Part 2&3 ${STATS.part2}）`)
console.log(`题目条目：${STATS.questions}`)
for (const s of SECTIONS) console.log(`  ${s.labelZh.padEnd(24, ' ')} ${s.topics.length}`)

if (warnings.length) {
  console.log(`\n⚠ 提醒 ${warnings.length} 条`)
  warnings.slice(0, 40).forEach((w) => console.log('  ' + w))
  if (warnings.length > 40) console.log(`  …另有 ${warnings.length - 40} 条`)
}

if (errors.length) {
  console.log(`\n✗ 错误 ${errors.length} 条`)
  errors.forEach((e) => console.log('  ' + e))
  process.exit(1)
}

console.log('\n✓ 数据结构校验通过')
