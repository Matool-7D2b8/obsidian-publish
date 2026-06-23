# 更新日志

## 2026-06-23

### 字体与样式
- 更换字体为 LXGW WenKai（霞鹜文楷），Google Fonts 构建时嵌入
- 基准字号从 16px 加大至 18px，全站文字等比例放大

### 修复
- 修复 `.gitignore` 屏蔽 `content/` 子目录导致 Quartz 无法发现笔记的问题（构建从 1 个文件恢复到 88 篇笔记）
- 修复 11 个源文件中 LaTeX 数学模式内中文/全角字符导致的 KaTeX 警告：
  - `$$中文标签：公式$$` → 使用 `\text{}` 包裹中文
  - `——>` → `\;\longrightarrow\;`
  - 涉及文件：极限计算.md、高阶导数求导.md、导数计算.md、绝对值相关.md、预备知识.md、网络性能指标.md、通信基础知识.md、差错控制.md、数组.md、散列表_hash.md、最佳归并树.md

### 维护
- 更新所有本地 Git remote 为迁移后的仓库地址（`125860197` → `Matool-7D2b8`）
- 日志文件统一迁移至 `log/` 目录

---

## 2026-06-14

### 新增
- 添加 CN（计算机网络）、CO（计算机组成原理）、OS（操作系统）目录到 Data_Struct vault 同步

### 修复
- 修复部署脚本因空目录（CO/OS）导致的 `cp` 失败，改用循环 + 存在性检查

---

## 2026-05-25

### 修复：笔记格式渲染错误

**问题**：数学笔记 `高阶导数求导.md` 网页格式混乱，14 个公式无法渲染。

**根因**：
1. `\begin{cases}...\end{cases}` 中的 `&` 对齐符被 markdown 预处理器转义为 `&amp;`，KaTeX 无法解析
2. `---` 被 markdown 转为破折号，破坏 LaTeX 公式

**修复方案**：
- 移除 `cases` 环境，拆分为两个独立公式
- 公式中 `---` 替换为数学符号（`\longrightarrow` 等）

---

## 2026-05-24

### 修复：网站未同步最新笔记

**问题**：新增 `Data_Struct/08_排序` 章节不显示，首页链接 404，图片无法加载。

**根因与修复**：
1. **obsidian-git 不自动 push**：三个 vault 的 `autoPushInterval` 均设为 `0`，commit 只保存在本地。修复：设为 `5`（每 5 分钟自动 push）
2. **nginx 缓存 contentIndex.json**：浏览器缓存导致侧边栏目录树不更新。修复：nginx 配置添加 `Cache-Control: no-cache` 头
3. **首页链接相对路径**：Quartz 默认链接解析方式与部署路径不匹配。修复：改为相对路径解析
4. **图片路径问题**：HTTPS clone 被 GFW 阻断。修复：GitHub Actions 中用 PAT 通过 HTTPS clone 私有仓库

---

## 2026-05-23

### 部署
- 初始化 Quartz 项目，接入三个 Obsidian vault（Data_Struct、Math_note、En_learn）
- 配置 GitHub Actions 自动构建部署（push 触发 + 每 15 分钟定时）
- 阿里云 nginx 部署，IP 访问 `http://47.108.63.224/`
- SSH 端口 22 → 22222（阿里云）

### 渲染
- 启用 HardLineBreaks 插件（Obsidian 风格换行）
- 链接解析改为相对路径
- 首页链接修正
