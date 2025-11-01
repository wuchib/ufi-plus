import Button from './src/button.vue'
import { withInstall } from '@ufi-plus/utils'
import type { SFCWithInstall } from '@ufi-plus/utils'

export const UButton: SFCWithInstall<typeof Button> = withInstall(Button)