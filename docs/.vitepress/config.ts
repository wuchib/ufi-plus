import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ufi-plus',
  description: 'A Vue 3 component library',
  themeConfig: {
    nav: [{ text: 'Guide', link: '/guide/intro' }, { text: 'Components', link: '/components/button' }],
    sidebar: {
      '/guide/': [{ text: 'Introduction', link: '/guide/intro' }],
      '/components/': [{ text: 'Button 按钮', link: '/components/button' }]
    }
  }
})
