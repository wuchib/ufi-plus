import { placementType, BasePlacement, PlacementAlign, ContentPos, ArrowPosition } from './popover'
import { TRIGGER_GAP } from './config'
import { Ref } from 'vue'

/**
 * 计算弹出层位置
 * @param placement 
 * @param triggerEl 
 * @param contentEl 
 * @param arrowEl 
 * @param contentPos 
 * @param currentPlacement 
 * @param currentAlign 
 * @param arrowPosition 
 * @returns 
 */
export function calcContentPos(
  placement: placementType,
  triggerEl: HTMLElement | null,
  contentEl: HTMLElement | null,
  arrowEl: HTMLElement | null,
  contentPos: Ref<ContentPos>,
  currentPlacement: Ref<any>,
  currentAlign: Ref<PlacementAlign>,
  arrowPosition: Ref<ArrowPosition>,
) {
  const triggerDomRect = triggerEl?.getBoundingClientRect()
  console.dir(triggerEl)
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
  

  const [basePlacement, rawAlign] = placement.split('-') as [BasePlacement, PlacementAlign?]

  let finalP: BasePlacement =  basePlacement ?? 'bottom'
  let align: PlacementAlign | '' = rawAlign ?? 'center'
  // 记录视口尺寸，方便判断剩余空间
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : document.documentElement.clientWidth
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : document.documentElement.clientHeight
  
  // 检查某个方向是否有足够空间容纳弹层
  const finalPlace = (placement: placementType) => {
    const map = {
      'top': ()=>{
        finalP = cHeight >= triggerDomRect.top ? 'top' : 'bottom'
        align = 'center'
      },
      'top-start': ()=>{
        finalP = cHeight >= triggerDomRect.top ? 'top' : 'bottom'
        align = 'start'
      },
      'top-end': ()=>{
        finalP = cHeight >= triggerDomRect.top ? 'top' : 'bottom'
        align = cWidth >= triggerDomRect.right ? 'end' : 'start'
      },
      'bottom': ()=>{
        finalP = 'bottom'
        align = 'center'
      },
      'bottom-start': ()=>{
        finalP = 'bottom'
        align = 'start'
      },
      'bottom-end': ()=>{
        finalP = 'bottom'
        align = cWidth >= triggerDomRect.right ? 'end' : 'start'
      },
      'left': ()=>{
        finalP = cWidth >= triggerDomRect.left ? 'left' : 'right'
        align = 'center'
      },
      'left-start': ()=>{
        finalP = cWidth >= triggerDomRect.left ? 'left' : 'right'
        align = 'start'
      },
      'left-end': ()=>{
        finalP = cWidth >= triggerDomRect.left ? 'left' : 'right'
        align = cHeight >= triggerDomRect.top ? 'end' : 'start'
      },
      'right': ()=>{
        const cHeightHalf = cHeight / 2
        const tHeightHalf = tHeight / 2
        align = cHeightHalf - tHeightHalf >= triggerDomRect.top ? 'start' : ''
        finalP = 'right'
      },
      'right-start': ()=>{
        finalP = 'right'
        align = 'start'
      },
      'right-end': ()=>{
        finalP = 'right'
        align = cHeight >= triggerDomRect.bottom ? 'start' : 'end'
      },
    }

    map[placement]()
  }
  finalPlace(placement)
  currentPlacement.value = finalP
  currentAlign.value = align
  arrowPosition.value = new ArrowPosition()
  if (finalP === 'top') {
    contentPos.value.top = triggerDomRect.top - cHeight - TRIGGER_GAP + window.scrollY
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

  if (finalP === 'bottom') {
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

  if (finalP === 'left') {
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

  if (finalP === 'right') {
    contentPos.value.left = triggerDomRect.right + TRIGGER_GAP
    arrowPosition.value.left = - arrowWidth / 2
    if (align === 'start') {
      contentPos.value.top = triggerDomRect.top + window.scrollY
      arrowPosition.value.top = tHeight / 2 - arrowHeight / 2
    } else if (align === 'end') {
      contentPos.value.top = triggerDomRect.bottom - cHeight + window.scrollY
      arrowPosition.value.bottom = tHeight / 2 - arrowHeight / 2
    } else {
      contentPos.value.top = triggerDomRect.top + (tHeight - cHeight) / 2 + window.scrollY
      arrowPosition.value.top = cHeight / 2 - arrowHeight / 2
    }
  }
}