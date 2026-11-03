# 日本語スピーキング練習帳 · 日语口语题库

把 **IELTS / 雅思口语题库**（2026 年 9–12 月，中国大陆主库 87 个话题）改写成**自然的日语题**，
做成一个仿原题库页面的刷题站：目录分区、话题卡片、搜索筛选、中日英对照。

- 90 个话题：Part 1 短问答 34 个，Part 2 & 3 长题 56 个
- 584 条题目，全部日语题干（附中文对照 + 英文原题，可开关）
- 纯静态站，Vite + React，零后端

## 快速开始

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 产物在 dist/
node scripts/check-data.mjs   # 题库数据自检
```

## 题库结构

对应原页的四个大分区：

| 分区 | Part 1 | Part 2 & 3 |
| --- | --- | --- |
| 一、新题（9 月新题） | 11 | 27（人物 11 / 地点 5 / 事物 2 / 事件 9） |
| 二、保留题 | 17 | 27（人物 5 / 地点 4 / 事物 10 / 事件 8） |
| 三、必考题（高频核心） | 5 | — |
| 四、补充报告题 | 1 | 2 |

数据在 `src/data/` 下按来源分文件，每条记录的字段：

```js
// Part 1
{
  id: 'p1-travelling',        // URL 锚点，需全站唯一
  section: 'new',             // new | retained | core | extra
  part: 1,
  group: 'part1',             // part1 | people | place | thing | event
  tag: '9月新题',
  titleJa: '旅行',
  titleZh: 'Travelling',
  titleEn: 'Travelling',
  questions: [{ ja: '長い旅は好きですか。', zh: '你喜欢长途旅行吗？', en: 'Do you enjoy long journeys?' }],
}

// Part 2 & 3
{
  id: 'p2-difficult-successful',
  section: 'new',
  part: 2,
  group: 'people',
  tag: '9月新题',
  titleJa: '難しいことに挑んで成功した人',
  titleZh: '做困难事情并成功的人',
  titleEn: 'Describe a person you know who did something difficult and was successful',
  cue:     { ja, zh, en },             // 题面
  bullets: [{ ja, zh, en }, ...],      // 4 条 cue point
  part3:   [{ ja, zh, en }, ...],      // 3 条深入提问
}
```

改完数据跑一次 `node scripts/check-data.mjs`，它会校验 id 唯一性、字段完整性、
每题数量（Part 1 = 4 问；Part 2 = 4 条 cue point + 3 问），并检查日语字段里是否混入简体字。

## 添加新话题

1. 在对应文件里按上面的结构追加一条记录；
2. 如果新开一个分区，在 `src/data/index.js` 的 `SECTIONS` 里挂上；
3. `node scripts/check-data.mjs && npm run build` 确认无误。

## 部署到 GitHub Pages

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动跑数据校验 → 构建 → 发布。

首次需要在仓库 **Settings → Pages → Source** 里选择 **GitHub Actions**。

站点地址会是 `https://<用户名>.github.io/<仓库名>/`。构建脚本会自动把 `BASE_PATH`
设成 `/仓库名/`；仓库改名不用改配置。本地预览构建产物时若路径不对，可手动覆盖：

```bash
BASE_PATH=/my-repo/ npm run build && npm run preview
```

## 许可

题库原文：Mr.Mou @ ShiShi AP Center《雅思口语 2026年9月-12月题库》，
<https://shishiapcs.github.io/esl-speaking-ielts-topics-september-to-december-2026/>。
本站为学习用途的日语改写与再编排，代码以 MIT License 发布（见 [LICENSE](LICENSE)）。
