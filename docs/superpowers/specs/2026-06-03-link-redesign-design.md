# 个人主页重设计 · 设计文档（B 炫酷 + D 高级感）

- **日期**: 2026-06-03
- **分支**: `feat-redesign`
- **项目**: `iofree/link`（个人 link-in-bio 主页，部署于 iofree.xyz）
- **状态**: 已通过 brainstorming，待用户复核 spec

## 1. 背景与目标

现有页面是基于 [LittleLink](https://littlelink.com) 的纯静态链接页，视觉平淡。目标是把它重做成一个**炫酷的独立开发者个人主页**，视觉方向为「**B 极光玻璃的炫酷** + **D 编辑感的高级**」融合：深色极光氛围 + 毛玻璃 + 克制的编辑式排版。

已确认决策（来自 brainstorming）：

| 维度 | 决定 |
|------|------|
| 视觉方向 | 极光玻璃 + 编辑感融合（用户已在可视化预览中确认） |
| 页面范围 | **精致单列链接页**（不做多区块长站、不加独立"关于我"页） |
| 中英双语 | **保留中/EN 切换，全部文字可切换**（修掉旧版 App 名硬编码不翻译的问题） |
| 技术方案 | **纯静态，零构建**（HTML + CSS + 原生 JS，部署方式不变） |
| 主题 | **仅深色**（极光美学本质暗色，不做浅色/auto） |

## 2. 总体方案

从零重写 `index.html` 与一套新 CSS，替换掉 LittleLink 的 `button-*` 体系，改为「极光背景 + 玻璃卡片 + 编辑式排版」的单列布局。保留并升级现有 `data-i18n` + JSON 的双语机制。不引入框架或打包工具。

**取舍**：采用干净重写而非在旧结构上改造——LittleLink 的按钮/骨架样式与新设计冲突，重写更省事、更可控。旧 LittleLink 样式文件移除。

## 3. 视觉系统（锁定规范）

- **基调**：深色背景 `#08070d`，文字 `#ECEAF5`。仅深色主题。
- **极光层**：4 团高斯模糊色块缓慢漂移（紫 `#7c3aed` / 青 `#22d3ee` / 粉 `#ec4899` / 蓝 `#3b82f6`），`position: fixed` 铺满视口，低透明度（≈ .5）+ 径向暗角遮罩（`veil`）保证文字可读。
- **质感细节**：
  - 细微噪点颗粒层（SVG `feTurbulence` data-URI，opacity ≈ .04）。
  - 头像外圈旋转的 conic-gradient 彩虹光晕。
  - 卡片毛玻璃：`backdrop-filter: blur(16px)`，半透明白底 + 1px 半透明白边。
- **字体**（全部系统字体栈，零下载）：
  - 名字/标题：衬线 `"Iowan Old Style","Palatino Linotype",Georgia,"Songti SC",serif`
  - 小标题/元信息：等宽 `"SF Mono",ui-monospace,Menlo,monospace`
  - 正文：无衬线 `-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif`
- **动效**：入场上浮淡入；卡片 hover 右移 + 霓虹左边线 + 边框提亮；头像光晕旋转；极光漂移。
- **无障碍**：`@media (prefers-reduced-motion: reduce)` 时关闭所有动画（光晕、极光、入场、hover 位移）。

## 4. 页面结构与内容

单列居中，`max-width ≈ 440px`，移动优先。自上而下：

1. **语言切换**：右上角 `position: fixed` 毛玻璃胶囊，文案 `中 / EN`，点击切换。
2. **Hero**：
   - 头像 `images/me.jpeg`（圆形，外圈旋转光晕）
   - 名字「顾惜朝」（衬线）
   - 副标题（等宽）：`Indie Developer · 独立开发者`
   - 一句简介（正文）
3. **作品 · Apps**：分区标题 + 4 张玻璃卡片，每张 = 图标 + 名字 + 一句话描述 + `↗`：
   | App | 链接 |
   |-----|------|
   | 人生笔记 | https://lifelog.iofree.xyz/ |
   | 人生规划局 | https://planning.iofree.xyz/ |
   | 不忘提醒 | https://apps.apple.com/cn/app/id1600249479 |
   | PasteQ | https://apps.apple.com/cn/app/id6443971843 |
4. **关注我 · Elsewhere**：分区标题 + 4 个玻璃图标按钮：
   | 平台 | 链接 |
   |------|------|
   | 小红书 | https://www.xiaohongshu.com/user/profile/626dc2bc00000000210247f0 |
   | 微博 | https://weibo.com/u/5894049515 |
   | Twitter | https://twitter.com/Allen_Xuxu |
   | YouTube | https://www.youtube.com/channel/UC6bVZVPtoFkslpX3V7RaRdQ |
5. **页脚**：反馈邮箱 `admin@iofree.xyz` + 版权行 `© 2026 顾惜朝 · iofree.xyz`。

所有链接 `target="_blank" rel="noopener"`。

### App 一句话描述（待用户确认/改写 — 暂拟）

| App | 中文（暂拟） | English（暂拟） |
|-----|------|---------|
| 人生笔记 | 记录每一刻的生活日记 | Journal every moment of life |
| 人生规划局 | 规划目标与人生进度 | Plan goals and life progress |
| 不忘提醒 | 强大的提醒与倒数日 | Powerful reminders & countdowns |
| PasteQ | 剪贴板管理利器 | Clipboard manager done right |

> **开放项**：以上描述需用户在 spec 复核时确认或替换为准确文案。

## 5. 双语架构

沿用 `data-i18n` 属性 + `js/i18n/<lang>.json` 的方案，但做两点升级：

1. **全量可切换**：页面上所有可见文字都带 `data-i18n`，包括 App 名、App 描述、分区标题（作品/关注我）、社交平台名（用于 `aria-label`）、简介、副标题、页脚。彻底解决旧版"只翻译标题/简介、App 名硬编码中文"的问题。
2. **`js/i18n.js` 优化**：
   - 语言选择：首次访问按**浏览器主语言**判定（中文 → 中文，否则英文）；用户**手动切换后记忆**到 `localStorage['preferred-language']`，之后优先于自动判定。中文为 HTML 内联默认（无请求、无闪烁）；英文按需 fetch。自动判定的语言只应用、不写入存储，仅手动切换才持久化。
   - 切换时持久化语言、更新 `<html lang>`、`document.title`、切换按钮文案。
   - `<a>` 元素注入 `innerHTML`，其余 `textContent`（沿用现有逻辑），社交按钮用 `aria-label` 承载平台名。
   - `zh.json` 与 `en.json` **键集必须完全一致**。

### i18n 键集（草案）

```
title, kicker, lede,
section_apps, section_social,
app_lifelog_name, app_lifelog_desc,
app_planning_name, app_planning_desc,
app_reminder_name, app_reminder_desc,
app_pasteq_name, app_pasteq_desc,
social_xhs, social_weibo, social_twitter, social_youtube,
feedback, copyright
```

## 6. 文件改动与资源

### 新增
- `css/style.css` —— 整套新样式（含极简 reset、极光层、玻璃卡片、响应式、reduced-motion）。

### 重写
- `index.html` —— 新单列结构 + 全量 `data-i18n` + 基础 SEO/OG meta。
- `js/i18n.js` —— 按上述优化。
- `js/i18n/zh.json`、`js/i18n/en.json` —— 扩展到覆盖全部文案。

### 移除（LittleLink 遗留，新设计不再使用）
- `css/brands.css`
- `css/skeleton-auto.css`、`css/skeleton-light.css`、`css/skeleton-dark.css`
- `css/language-switcher.css`
- `css/normalize.css`（改为在 `style.css` 内联极简 reset）
- `fonts/`（Open Sans webfont，新设计用系统字体，不再需要）

### 图标加载（用户决定，2026-06-03）
- App 图标 + 小红书/微博图标 **继续从苹果 CDN（`is1-ssl.mzstatic.com`）远程加载**，借用 Apple CDN 的稳定性与就近加速。
- Twitter / YouTube 使用本地 SVG（`images/icons/`），保留（它们不在苹果 CDN 上）。

### 保留
- `images/me.jpeg`（头像 + favicon）。

### 顺手补充
- 基础 SEO / Open Graph meta（`og:title`、`og:description`、`og:image` 用头像、`og:type`、`twitter:card`），分享时有预览。
- `<link rel="icon">` 指向 `images/me.jpeg`（沿用）。

## 7. 验收标准

- [ ] 页面在桌面与移动端（窄屏）均正确呈现单列布局，无横向滚动。
- [ ] 中/EN 切换可用：所有文字（含 App 名、描述、分区标题、社交、页脚）随切换变化；刷新后保持上次语言；首屏无空白闪烁。
- [ ] `zh.json` 与 `en.json` 键集一致，无遗漏键导致的空白。
- [ ] 4 个 App 链接、4 个社交链接、反馈邮箱均正确且 `target=_blank rel=noopener`。
- [ ] App / 社交图标从苹果 CDN（`mzstatic.com`）正常加载并显示；Twitter/YouTube 本地 SVG 正常显示。
- [ ] 开启系统"减少动态效果"时，动画全部停用。
- [ ] 旧 LittleLink CSS / fonts 已移除，仓库无失效引用。
- [ ] 纯静态：`python3 -m http.server` 起本地服务即可正常运行（注意 i18n 用 `fetch`，需 HTTP 而非 `file://`）。

## 8. 不在本次范围（YAGNI）

- 浅色 / auto 主题。
- 多区块长页面、独立"关于我"页、作品集详情页。
- 引入框架 / 构建工具 / CSS 预处理器。
- 新增语言（仅中、英）。
- 后端 / 表单 / 分析统计。
