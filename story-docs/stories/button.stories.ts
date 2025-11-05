import type { Meta, StoryObj } from '@storybook/vue3'

import { UButton } from '@ufi-plus/components'

const meta: Meta<typeof UButton> = {
  title: 'Components/Button',
  component: UButton,
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'info'],
    },
    round: { control: 'boolean' },
    plain: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    type: 'default',
    round: false,
    plain: false,
    loading: false,
    disabled: false,
  },
  render: (args) => ({
    components: { UButton },
    setup() {
      return { args }
    },
    template: '<UButton v-bind="args">默认按钮</UButton>',
  }),
}

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    type: 'success',
    round: true,
  },
}

export const Loading: Story = {
  args: {
    type: 'primary',
    loading: true,
  },
}
