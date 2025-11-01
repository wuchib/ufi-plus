#!/bin/bash

# ======== 组件生成脚本 ==========
# 用法: pnpm gen button

# 组件名参数
name=$1

if [ -z "$name" ]; then
  echo "❌ 请输入组件名，例如：pnpm gen button"
  exit 1
fi

# 组件路径
base_dir="packages/components/src/$name"

# 如果存在则退出
if [ -d "$base_dir" ]; then
  echo "⚠️ 组件 $name 已存在: $base_dir"
  exit 1
fi

# 将首字母转大写生成 PascalCase 名称
# e.g. button -> Button, input-number -> InputNumber
pascal_name=$(echo "$name" | sed -r 's/(^|-)([a-z])/\U\2/g')

# 创建目录结构
mkdir -p "$base_dir/src" "$base_dir/style" "$base_dir/tests"

# 写入文件
# index.ts
cat > "$base_dir/index.ts" <<EOF
import $name from './src/$name.vue'

export default $name
EOF

# src/button.vue
cat > "$base_dir/src/$name.vue" <<EOF
<template>
  <div class="$name">$name</div>
</template>

<script setup lang="ts">
// TODO: component logic
</script>

<style scoped>
.$name {}
</style>
EOF

# src/button.vue
cat > "$base_dir/src/$name.ts" <<EOF
import type { ExtractPropTypes } from 'vue'
export const ${name}Props = {}
export const ${name}Emits = {}

export type ${pascal_name}Props = ExtractPropTypes<typeof ${name}Props>
export type ${pascal_name}Emits = typeof ${name}Emits
EOF
# tests/button.test.tsx
cat > "$base_dir/tests/$name.test.tsx" <<EOF
import { describe, it, expect } from 'vitest'

describe('$name', () => {
  it('should render correctly', () => {
    expect(true).toBe(true)
  })
})
EOF

echo "✅ 已生成组件：$name"
echo "📁 路径：$base_dir"
