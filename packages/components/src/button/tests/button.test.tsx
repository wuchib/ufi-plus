import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../src/button.vue'

describe('UButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click Me' },
    })
    expect(wrapper.find('.ufi-button__content').text()).toBe('Click Me')
  })

  it('has base and default type classes', () => {
    const wrapper = mount(Button)
    const btn = wrapper.get('button')
    expect(btn.classes()).toContain('ufi-button')
    expect(btn.classes()).toContain('ufi-button--default')
  })

  it('applies type class', () => {
    const wrapper = mount(Button, { props: { type: 'primary' } })
    expect(wrapper.get('button').classes()).toContain('ufi-button--primary')
  })

  it('applies plain and round classes', () => {
    const wrapper = mount(Button, { props: { plain: true, round: true } })
    const classes = wrapper.get('button').classes()
    expect(classes).toContain('is-plain')
    expect(classes).toContain('is-round')
  })

  it('shows spinner and disables when loading', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    const btn = wrapper.get('button')
    expect(wrapper.find('.ufi-button__spinner').exists()).toBe(true)
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('disables when disabled prop is true', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })
})
