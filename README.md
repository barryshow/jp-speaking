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

## 部署与自定义域名

正式地址：**<https://jlpt.barryshow.net/>**

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动跑数据校验 → 构建 → 发布到
GitHub Pages。构建以根路径（`BASE_PATH=/`）产出，仓库根的 `public/CNAME` 声明自定义域名
`jlpt.barryshow.net`，Vite 构建时会自动把它复制到 `dist/`。

GitHub Pages 侧需要（仓库 **Settings → Pages**）：

- Source 选择 **GitHub Actions**；
- Custom domain 填 `jlpt.barryshow.net`，DNS 生效后勾选 **Enforce HTTPS**。

Cloudflare DNS 侧新增一条记录：

| 类型 | 名称 | 内容 | 代理状态 |
| --- | --- | --- | --- |
| CNAME | `jlpt` | `barryshow.github.io` | **DNS only**（灰云） |

不要开橙云：Cloudflare 代理 GitHub Pages 容易出现重定向循环，且 GitHub 签发证书需要直连回源。
DNS 生效后 GitHub 会自动签发 Let's Encrypt 证书，通常几分钟内可用。

如果临时想回到 GitHub Pages 的项目子路径（`https://<用户名>.github.io/<仓库名>/`），
把 `public/CNAME` 删掉并按子路径构建即可：

```bash
BASE_PATH=/jlpt-speaking/ npm run build
```

## 许可

题库原文：Mr.Mou @ ShiShi AP Center《雅思口语 2026年9月-12月题库》，
<https://shishiapcs.github.io/esl-speaking-ielts-topics-september-to-december-2026/>。
本站为学习用途的日语改写与再编排，代码以 MIT License 发布（见 [LICENSE](LICENSE)）。
