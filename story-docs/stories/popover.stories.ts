import type { Meta, StoryObj } from '@storybook/vue3'

import { UPoppover, UButton } from '@ufi-plus/components'

const meta: Meta<typeof UPoppover> = {
  title: 'Components/Poppover',
  component: UPoppover,
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
  render: (args) => {

    const getBtnTxt = () => args.trigger === 'click' ? '点击触发' : '悬停触发'

    return {
      components: { UPoppover, UButton },
      setup() {
        return { args }
      },
      template: `
        <UPoppover v-bind="args">
          <UButton>${ getBtnTxt()  }</UButton>
        </UPoppover>
      `,
    }
  },
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
