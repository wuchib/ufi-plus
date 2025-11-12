import Popover from './src/popover.vue'
import { withInstall } from '@ufi-plus/utils'
import type { SFCWithInstall } from '@ufi-plus/utils'

export const UPoppover: SFCWithInstall<typeof Popover> = withInstall(Popover)
