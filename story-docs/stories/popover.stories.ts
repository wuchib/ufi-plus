import type { Meta, StoryObj } from '@storybook/vue3'

import { UPoppover, UButton } from '@ufi-plus/components'
import './popover.stories.css'

const placementOptions = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end',
]

const meta: Meta<typeof UPoppover> = {
  title: 'Components/Poppover',
  component: UPoppover,
  // parameters: {
  //   layout: 'fullscreen',
  // },
  argTypes: {
    trigger: {
      control: 'select',
      options: ['hover', 'click'],
    },
    placement: {
      control: 'select',
      options: placementOptions,
    },
  },
  args: {
    trigger: 'click',
    placement: 'bottom',
  },
  render: (args) => ({
    components: { UPoppover, UButton },
    setup() {
      return { args }
    },
    template: `
      <div class="story-popover-page">
        <div class="story-popover-inner">
          <UPoppover v-bind="args">
            <UButton type="primary">
              {{ args.trigger === 'click' ? '点击触发' : '悬停触发' }}
            </UButton>
          </UPoppover>
          <div
            v-for="n in 8"
            :key="'top-' + n"
            class="story-popover-placeholder"
          >
            上方占位 {{ n }}
          </div>
          <UPoppover v-bind="args">
            <UButton type="primary">
              {{ args.trigger === 'click' ? '点击触发' : '悬停触发' }}
            </UButton>
            <template #content>
              <input />
              <input />
              <input />
              <input />
            </template>
          </UPoppover>

          <div
            v-for="n in 10"
            :key="'bottom-' + n"
            class="story-popover-placeholder"
          >
            下方占位 {{ n }}
          </div>
        </div>
      </div>
    `,
  }),
}

export default meta

type Story = StoryObj<typeof meta>

export const PopBasic: Story = {
  args: {
    trigger: 'hover',
    placement: 'top',
  },
}

export const PlacementGallery: Story = {
  args: {
    trigger: 'click',
  },
  render: (args) => ({
    components: { UPoppover, UButton },
    setup() {
      return { args, placementOptions }
    },
    template: `
      <div class="story-popover-gallery">
        <div class="story-popover-gallery__hint">
          Hover / Click 按钮体验所有方向与对齐方式的动效
        </div>
        <div class="story-popover-gallery__grid">
          <div
            v-for="placement in placementOptions"
            :key="placement"
            class="story-popover-gallery__item"
          >
            <div class="story-popover-gallery__label">{{ placement }}</div>
            <UPoppover v-bind="args" :placement="placement">
              <UButton type="primary" size="small">示例</UButton>
              <template #content>
                <div>Placement: {{ placement }}</div>
                <div>Trigger: {{ args.trigger }}</div>
                <small>start/end 对齐也会有不同动画</small>
              </template>
            </UPoppover>
          </div>
        </div>
      </div>
    `,
  }),
}

// export const Loading: Story = {
//   args: {
//     type: 'primary',
//     loading: true,
//   },
// }
