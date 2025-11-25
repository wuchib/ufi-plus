import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ufi-plus',
  description: 'A Vue 3 component library',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/intro' },
      {
        text: 'Components',
        items: [
          { text: 'Button', link: '/components/button' },
          { text: 'Popover', link: '/components/popover' }
        ]
      }
    ],
    sidebar: {
      '/guide/': [{ text: 'Introduction', link: '/guide/intro' }],
      '/components/': [
        { text: 'Button', link: '/components/button' },
        { text: 'Popover', link: '/components/popover' }
      ]
    }
  }
})
