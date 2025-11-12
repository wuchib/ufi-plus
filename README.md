# UFI Plus 🌟

基于 Vue 3 + PNPM 的组件库脚手架，目录风格参考 Element Plus，内置主题样式、文档、Playground、Storybook 等开发配套工具，便于在多包仓库中快速沉淀可复用的 UI 资产。

## 🗂️ 仓库结构

```
ufi-plus/
├─ packages/
│  ├─ ufi-plus/             # 组件库对外发布入口，聚合导出并引入样式
│  ├─ components/           # 组件源码（Button、Popover 等）
│  ├─ theme-chalk/          # 主题样式，风格与 Element Plus 的 theme-chalk 类似
│  ├─ utils/ hooks/ ...     # 工具、hooks、常量、国际化等辅助模块
│  ├─ play/                 # Vite 本地 Playground，用于真机/交互验证
│  └─ docs/                 # VitePress 文档站
├─ story-docs/              # Storybook 配置与示例
├─ pnpm-workspace.yaml      # PNPM 工作区配置
└─ tsconfig.base.json       # 通用 TypeScript 配置
```

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 构建所有包（生成 dist 与类型）
pnpm -w build && pnpm -w build:types

# 启动本地 Playground (packages/play)
pnpm dev
```

### 🧪 Storybook（组件交互示例）
```bash
pnpm storybook
```
打开控制台输出的 URL（默认 http://localhost:6006），即可查看 `story-docs/stories` 中的交互示例，例如 Popover 滚动定位场景。

### 📘 文档站 (VitePress)
```bash
pnpm docs:dev      # 开发
pnpm docs:build    # 产出静态文件
```

### ✅ Lint & Test
```bash
pnpm lint          # ESLint + eslint-plugin-vue
pnpm test          # Vitest
pnpm vue-tsc --noEmit   # 类型检查（可组合）
```

## 🛠️ 开发约定

- 使用 `@ufi-plus/components` 作为组件出口，样式由 `@ufi-plus/theme-chalk` 提供。
- 组件内部首选 Composition API（`script setup`），并在 `packages/components` 中按需导出。
- 若需要在 Storybook 中验证场景，可在 `story-docs/stories` 新增 `.stories.ts`，并复用 `@ufi-plus/components` 的真实实现。
- popover 等需要和宿主 DOM 交互的组件，推荐通过 `ResizeObserver + scroll listener` 等方式保持定位同步（详见 `packages/components/src/popover`）。

## 📦 发布流程

1. 通过 Changesets 记录版本变更：
   ```bash
   pnpm changeset
   ```
2. 发布前在工作区重装并产出：
   ```bash
   pnpm release   # 执行 changeset version + pnpm i -w + changeset publish
   ```
3. 如需 Dry-run，可手动运行 `pnpm changeset version` 后检查各 package 的版本与 changelog。

## 🤝 常见问题

- **组件样式未生效？** 确认 `@ufi-plus/theme-chalk/index.css` 已在入口（如 Storybook `preview.ts`、Playground `main.ts`）引入。
- **Popover/Teleport 定位异常？** 检查触发器 `triggerEl` 是否在 `watch` 中监听，并在滚动/resize 时调用 `calcContentPos`。
- **多包依赖引用不到？** 运行 `pnpm install` 时务必在仓库根目录，并确保 `packageManager` 版本与 `pnpm-workspace.yaml` 匹配。

---

欢迎根据业务需要扩展更多组件或工具脚本。如发现问题，直接在对应包提交 PR/Issue，一起把 UFI Plus 打磨得更好！💪
