import type { ExtractPropTypes, PropType } from 'vue'
export const popoverProps = {
  trigger: {
    type: String as PropType<'click' | 'hover'>,
    default: 'hover',
  },
  placement: {
    type: String as PropType<'top' | 'bottom' | 'left' | 'right'>,
    default: 'top',
  },
} as const

export const popoverEmits = {}

// export type PopoverProps = ExtractPropTypes<typeof popoverProps>


export type placementType = "top" | "bottom" | "left" | "right"

export type PopoverProps = {
  trigger?: 'click' | 'hover'
  placement?: 'top' | 'bottom' | 'left' | 'right'
}
export type PopoverEmits = typeof popoverEmits
