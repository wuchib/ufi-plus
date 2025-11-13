import type { Meta, StoryObj } from '@storybook/vue3'

import { UPoppover, UButton } from '@ufi-plus/components'
import './popover.stories.css'

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
      options: ['top', 'left', 'right', 'bottom'],
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
          </UPoppover>

          <UPoppover v-bind="args">
            <UButton type="primary">
              {{ args.trigger === 'click' ? '点击触发' : '悬停触发' }}
            </UButton>
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

// export const Loading: Story = {
//   args: {
//     type: 'primary',
//     loading: true,
//   },
// }
