import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type BasePlacement = 'top' | 'bottom' | 'left' | 'right'
export type PlacementAlign = 'start' | 'end' | 'center'
export type ContentPos = { top: number; left: number }
export class ArrowPosition {
  left: number | undefined = undefined
  top: number | undefined = undefined
  right: number | undefined = undefined
  bottom: number | undefined = undefined
}


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



export type PopoverProps = {
  trigger?: triggerType
  placement?: placementType
  visible?: boolean,
  showArrow?: boolean,
  popClass?:string,
}
export type PopoverEmits = {
  (e: 'update:visible', value: boolean): void
  (e: 'show', value: boolean): void
  (e: 'hide', value: boolean): void
}

export type PopoverContext = {
  isOpen: Ref<boolean>
  trigger: ComputedRef<triggerType>
  placement: ComputedRef<placementType>
  showArrow: ComputedRef<boolean>
  popClass: ComputedRef<string>
  triggerEl: Ref<HTMLElement | null>
  contentEl: Ref<HTMLElement | null>
  arrowEl: Ref<HTMLElement | null>,
  show: () => void
  hide: () => void
  hideWithDelay: () => void
  toggle: () => void
  onContentMouseEnter: () => void
  onContentMouseLeave: () => void
}

export const popoverContextKey: InjectionKey<PopoverContext> = Symbol('ufi-popover-context')
