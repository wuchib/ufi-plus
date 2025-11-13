import type { ExtractPropTypes, PropType } from 'vue'

export type placementType = "top" | "bottom" | "left" | "right"
export type triggerType = 'click' | 'hover'

export const popoverEmits = {}



export type PopoverProps = {
  trigger?: triggerType
  placement?: placementType
}
export type PopoverEmits = typeof popoverEmits
