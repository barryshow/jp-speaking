import newPart1 from './newPart1.js'
import newPart2 from './newPart2.js'
import retainedPart1 from './retainedPart1.js'
import retainedPart2 from './retainedPart2.js'
import corePart1 from './corePart1.js'
import supplementary from './supplementary.js'

/** 分组（对应原页的「人物类 / 地点类 / 事物类 / 事件类」） */
export const GROUPS = {
  part1: { label: 'Part 1', ja: 'Part 1', en: 'Part 1' },
  people: { label: '人物类', ja: '人物', en: 'People' },
  place: { label: '地点类', ja: '場所', en: 'Places' },
  thing: { label: '事物类', ja: 'モノ・コト', en: 'Things' },
  event: { label: '事件类', ja: '出来事', en: 'Events' },
}

/** 大分区，顺序与原页一致 */
export const SECTIONS = [
  {
    id: 'new',
    label: '一、新題',
    labelZh: '一、新题',
    en: 'New topics',
    note: '🔥 9月新題',
    topics: newPart1,
  },
  {
    id: 'new-p2',
    label: '一、新題（Part 2 & 3）',
    labelZh: '一、新题（Part 2 & 3）',
    en: 'New topics — Part 2 & 3',
    note: null,
    topics: newPart2,
  },
  {
    id: 'retained',
    label: '二、保留題',
    labelZh: '二、保留题',
    en: 'Retained topics',
    note: null,
    topics: retainedPart1,
  },
  {
    id: 'retained-p2',
    label: '二、保留題（Part 2 & 3）',
    labelZh: '二、保留题（Part 2 & 3）',
    en: 'Retained topics — Part 2 & 3',
    note: null,
    topics: retainedPart2,
  },
  {
    id: 'core',
    label: '三、必須題',
    labelZh: '三、必考题',
    en: 'Core topics',
    note: '高頻核心',
    topics: corePart1,
  },
  {
    id: 'extra',
    label: '四、追加報告題',
    labelZh: '四、补充报告题',
    en: 'Supplementary',
    note: '補足',
    topics: supplementary,
  },
]

export const ALL_TOPICS = SECTIONS.flatMap((s) =>
  s.topics.map((t) => ({ ...t, sectionId: s.id, sectionLabel: s.labelZh })),
)

export const STATS = {
  total: ALL_TOPICS.length,
  part1: ALL_TOPICS.filter((t) => t.part === 1).length,
  part2: ALL_TOPICS.filter((t) => t.part === 2).length,
  questions: ALL_TOPICS.reduce(
    (n, t) => n + (t.part === 1 ? t.questions.length : t.bullets.length + t.part3.length + 1),
    0,
  ),
}
