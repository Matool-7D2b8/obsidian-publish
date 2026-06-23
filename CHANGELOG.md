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

---

## 2026-06-14

### 新增
- 添加 CN（计算机网络）、CO（计算机组成原理）、OS（操作系统）目录到 Data_Struct vault 同步

### 修复
- 修复部署脚本因空目录（CO/OS）导致的 `cp` 失败，改用循环 + 存在性检查

---

## 2026-05-25 ~ 2026-06-13

### 部署
- 初始化 Quartz 项目，接入三个 Obsidian vault（Data_Struct、Math_note、En_learn）
- 配置 GitHub Actions 自动构建部署（push 触发 + 每 15 分钟定时）
- SSH 端口 22 → 22222（阿里云）
- 使用 PAT 克隆私有仓库

### 渲染
- 启用 HardLineBreaks 插件（Obsidian 风格换行）
- 链接解析改为相对路径
- 首页链接修正
