# ufi-plus (Element Plus 风格目录)

```
ufi-plus/
├─ packages/
│  ├─ ufi-plus/            # 发布入口，聚合导出 + 引入样式
│  ├─ components/          # 组件源代码（Button 示例）
│  ├─ theme-chalk/         # 主题样式（类似 Element Plus 的 theme-chalk）
│  ├─ utils/ hooks/ constants/ locale/  # 辅助包
├─ play/                   # 本地 Playground（Vite）
├─ docs/                   # 文档站（VitePress）
├─ pnpm-workspace.yaml
└─ tsconfig.base.json
```

## 开发

```bash
pnpm i
pnpm -w build
pnpm dev   # 启动 play
```

## 发布（示例）
使用 Changesets：

```bash
pnpm changeset
pnpm release
```
