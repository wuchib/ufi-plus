# Popover

A floating layer for lightweight tips or rich content around a trigger. Hover is default; click and placement can be adjusted.

## Basic hover
```vue
<script setup lang="ts">
import { UPoppover, UButton } from 'ufi-plus'
</script>

<template>
  <UPoppover placement="bottom">
    <UButton type="primary">Hover me</UButton>
    <template #content>
      <div style="padding: 6px 10px; max-width: 240px;">
        Simple hover popover that follows the trigger position.
      </div>
    </template>
  </UPoppover>
</template>
```

## Click trigger
```vue
<template>
  <UPoppover trigger="click" placement="right-start">
    <UButton type="primary">Click me</UButton>
    <template #content>
      <div style="padding: 6px 10px;">Content shown after clicking</div>
    </template>
  </UPoppover>
</template>
```

## Controlled visibility
> When `visible` is provided, visibility is fully controlled by the parent. Hover/click will not change it automatically.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UPoppover, UButton } from 'ufi-plus'

const visible = ref(false)
</script>

<template>
  <div style="display: flex; gap: 12px; align-items: center;">
    <UPoppover :visible="visible" placement="top">
      <UButton type="primary">External toggle</UButton>
      <template #content>
        <div style="padding: 6px 10px;">`visible` is changed outside the component</div>
      </template>
    </UPoppover>

    <UButton @click="visible = !visible">Toggle visible</UButton>
  </div>
</template>
```

## Props
| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `trigger` | How to show the popover | `'hover'` \| `'click'` | `hover` |
| `placement` | Popover placement (`top(-start/-end)`, `bottom(-start/-end)`, `left(-start/-end)`, `right(-start/-end)`) | `string` | `bottom` |
| `visible` | Controlled visibility; when set the component will not change it itself | `boolean` | `undefined` |
| `showArrow` | Whether to render the arrow | `boolean` | `true` |
| `popClass` | Extra class name applied to the inner content container | `string` | `''` |

## Slots
| Slot | Description |
| --- | --- |
| `default` | Trigger element; the first child is treated as the trigger area |
| `content` | Popover content area for text or custom markup |

## Events
| Event | Description | Callback |
| --- | --- | --- |
| `update:visible` | Fires when internal visibility changes (only when uncontrolled) | `(value: boolean) => void` |

*Tip: when using controlled visibility, handle interactions and set `visible` in your own logic if you want hover/click to respond.*
