import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type placementType =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'
export type triggerType = 'click' | 'hover'

export const popoverEmits = {}



export type PopoverProps = {
  trigger?: triggerType
  placement?: placementType
}
export type PopoverEmits = typeof popoverEmits

export type PopoverContext = {
  isOpen: Ref<boolean>
  trigger: ComputedRef<triggerType>
  placement: ComputedRef<placementType>
  triggerEl: Ref<HTMLElement | null>
  contentEl: Ref<HTMLElement | null>
  show: () => void
  hide: () => void
  hideWithDelay: () => void
  toggle: () => void
  onContentMouseEnter: () => void
  onContentMouseLeave: () => void
}

export const popoverContextKey: InjectionKey<PopoverContext> = Symbol('ufi-popover-context')
