import type { StorybookConfig } from '@storybook/vue3-vite'
import type { InlineConfig, PluginOption } from 'vite'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'

const normalizePlugins = (plugins: InlineConfig['plugins']): PluginOption[] => {
  if (!plugins) {
    return []
  }
  if (Array.isArray(plugins)) {
    return plugins.flatMap((plugin) => normalizePlugins(plugin))
  }
  return [plugins]
}

const hasVuePlugin = (plugins: PluginOption[]): boolean => {
  return plugins.some((plugin) => {
    if (!plugin) {
      return false
    }
    if (Array.isArray(plugin)) {
      return hasVuePlugin(plugin)
    }
    return 'name' in plugin && plugin.name === 'vite:vue'
  })
}

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config: InlineConfig) => {
    config.optimizeDeps = {
      ...(config.optimizeDeps ?? {}),
      exclude: [...(config.optimizeDeps?.exclude ?? []), '@ufi-plus/components', '@ufi-plus/utils'],
    }
    config.ssr = {
      ...(config.ssr ?? {}),
      noExternal: [
        ...(Array.isArray(config.ssr?.noExternal) ? config.ssr.noExternal : []),
        '@ufi-plus/components',
        '@ufi-plus/utils',
      ],
    }
    config.resolve = {
      ...(config.resolve ?? {}),
      alias: {
        ...(config.resolve?.alias ?? {}),
        '@ufi-plus': path.resolve(__dirname, '../..', 'packages'),
      },
    }
    config.plugins = config.plugins ?? []
    // 避免重复添加
    const plugins = normalizePlugins(config.plugins)
    if (!hasVuePlugin(plugins)) {
      plugins.push(vue())
    }
    config.plugins = plugins

    return config
  },
}

export default config
