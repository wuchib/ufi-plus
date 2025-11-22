import { placementType, BasePlacement, PlacementAlign, ContentPos, ArrowPosition } from './popover'
import { TRIGGER_GAP } from './config'
import { Ref } from 'vue'

/**
 * 计算弹出层位置
 * @param val 
 */
export function calcContentPos(
  val: placementType,
  triggerEl: HTMLElement | null,
  contentEl: HTMLElement | null,
  arrowEl: HTMLElement | null,
  contentPos: Ref<ContentPos>,
  currentPlacement: Ref<BasePlacement>,
  currentAlign: Ref<PlacementAlign>,
  arrowPosition: Ref<ArrowPosition>,
) {
  const triggerDomRect = triggerEl?.getBoundingClientRect()
  const contentDom = contentEl

  if (!triggerDomRect || !contentDom) return

  // 使用 offset 尺寸，避免入场过渡的 transform 缩放影响初次测量
  const cWidth = contentDom.offsetWidth
  const cHeight = contentDom.offsetHeight
  const tWidth = (triggerEl as HTMLElement).offsetWidth
  const tHeight = (triggerEl as HTMLElement).offsetHeight

  // 箭头的宽高
  const arrowWidth = (arrowEl as HTMLElement).offsetWidth
  const arrowHeight = (arrowEl as HTMLElement).offsetHeight
  

  const [basePlacement, rawAlign] = val.split('-') as [BasePlacement, PlacementAlign?]
  const align: PlacementAlign = rawAlign ?? 'center'
  // 记录视口尺寸，方便判断剩余空间
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : document.documentElement.clientWidth
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : document.documentElement.clientHeight
  
  // 定义相反方向，用于空间不足时兜底
  const oppositePlacement: Record<BasePlacement, BasePlacement> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left'
  }

  // 检查某个方向是否有足够空间容纳弹层
  const canFit = (placement: BasePlacement) => {
    switch (placement) {
      case 'top':
        return triggerDomRect.top >= cHeight
      case 'bottom':
        return viewportHeight - triggerDomRect.bottom >= cHeight
      case 'left':
        return triggerDomRect.left >= cWidth
      case 'right':
        return viewportWidth - triggerDomRect.right >= cWidth
      default:
        return true
    }
  }

  // 决定最终方向：优先原始方向，不行再尝试相反方向
  const resolvedPlacement: BasePlacement = (() => {
    if (canFit(basePlacement)) return basePlacement
    const fallback = oppositePlacement[basePlacement]
    return fallback && canFit(fallback) ? fallback : basePlacement
  })()
  currentPlacement.value = resolvedPlacement
  currentAlign.value = align
  Object.assign(arrowPosition, new ArrowPosition())
  if (resolvedPlacement === 'top') {
    contentPos.value.top = triggerDomRect.top - cHeight - TRIGGER_GAP
    arrowPosition.value.bottom = - arrowHeight / 2
    if (align === 'start') {
      contentPos.value.left = triggerDomRect.left
      arrowPosition.value.left = tWidth / 2 - arrowWidth / 2
    } else if (align === 'end') {
      contentPos.value.left = triggerDomRect.right - cWidth
      arrowPosition.value.right = tWidth / 2 - arrowWidth / 2
    } else {
      contentPos.value.left = triggerDomRect.left + (tWidth - cWidth) / 2
      arrowPosition.value.left = cWidth / 2 - arrowWidth / 2
    }
    return
  }

  if (resolvedPlacement === 'bottom') {
    contentPos.value.top = triggerDomRect.bottom + TRIGGER_GAP
    arrowPosition.value.top = - arrowHeight / 2
    if (align === 'start') {
      contentPos.value.left = triggerDomRect.left
      arrowPosition.value.left = tWidth / 2 - arrowWidth / 2
    } else if (align === 'end') {
      contentPos.value.left = triggerDomRect.right - cWidth
      arrowPosition.value.right = tWidth / 2 - arrowWidth / 2
    } else {
      contentPos.value.left = triggerDomRect.left + (tWidth - cWidth) / 2
      arrowPosition.value.left = cWidth / 2 - arrowWidth / 2
    }
    return
  }

  if (resolvedPlacement === 'left') {
    contentPos.value.left = triggerDomRect.left - cWidth - TRIGGER_GAP
    arrowPosition.value.right = - arrowWidth / 2
    if (align === 'start') {
      contentPos.value.top = triggerDomRect.top
      arrowPosition.value.top = tHeight / 2 - arrowHeight / 2
    } else if (align === 'end') {
      contentPos.value.top = triggerDomRect.bottom - cHeight
      arrowPosition.value.bottom = tHeight / 2 - arrowHeight / 2
    } else {
      console.log(cHeight, cWidth,'cHeight, cWidth');
      contentPos.value.top = triggerDomRect.top + (tHeight - cHeight) / 2
      arrowPosition.value.top = cHeight / 2 - arrowHeight / 2
    }
    return
  }

  if (resolvedPlacement === 'right') {
    contentPos.value.left = triggerDomRect.right + TRIGGER_GAP
    arrowPosition.value.left = - arrowWidth / 2
    if (align === 'start') {
      contentPos.value.top = triggerDomRect.top
      arrowPosition.value.top = tHeight / 2 - arrowHeight / 2
    } else if (align === 'end') {
      contentPos.value.top = triggerDomRect.bottom - cHeight
      arrowPosition.value.bottom = tHeight / 2 - arrowHeight / 2
    } else {
      contentPos.value.top = triggerDomRect.top + (tHeight - cHeight) / 2
      arrowPosition.value.top = cHeight / 2 - arrowHeight / 2
    }
  }
}