import { placementType, BasePlacement, PlacementAlign, ContentOffset, ArrowPosition } from './popover'
import { TRIGGER_GAP } from './config'
import { Ref } from 'vue'


const vWidth = typeof window !== 'undefined' ? window.innerWidth : document.documentElement.clientWidth
const vHeight = typeof window !== 'undefined' ? window.innerHeight : document.documentElement.clientHeight

/**
 * 计算弹出层位置
 * @param placement
 * @param triggerEl
 * @param contentEl
 * @param arrowEl
 * @param contentOffset
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
  contentOffset: Ref<ContentOffset>,
  currentPlacement: Ref<any>,
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
  const arrowWidth = arrowEl?.offsetWidth ?? 0
  const arrowHeight = arrowEl?.offsetHeight ?? 0

  const [basePlacement, rawAlign] = placement.split('-') as [BasePlacement, PlacementAlign?]

  let finalP: BasePlacement = basePlacement ?? 'bottom'
  let align: PlacementAlign | '' = rawAlign ?? 'center'

  const { top, bottom, left, right } = triggerDomRect

  // 检查某个方向是否有足够空间容纳弹层
  const finalPlace = (placement: placementType) => {
    const cWidthWithGap = cWidth + TRIGGER_GAP
    const cHeightWithGap = cHeight + TRIGGER_GAP
    const setTopOrBottom = () => { finalP = cHeightWithGap >= top ? 'bottom' : 'top' }
    const setBottom = () => { finalP = 'bottom' }
    const setLeftOrRightFromLeft = () => {finalP = cWidthWithGap >= left ? 'right' : 'left'}
    const setRight = () => { finalP = cWidthWithGap > vWidth - right ? ( cWidthWithGap >= left ? 'right' : 'left') :'right' }
    const alignTopBottomCenter = () => ((cWidth - tWidth) / 2 >= left ? 'start' : 'center')
    const alignLeftRightCenter = () => ((cHeight - tHeight) / 2 >= top ? 'start' : '')

    const map: Record<placementType, () => void> = {
      // ===== TOP 系 =====
      top: () => {
        setTopOrBottom()
        align = alignTopBottomCenter()
      },
      'top-start': () => {
        setTopOrBottom()
        align = 'start'
      },
      'top-end': () => {
        setTopOrBottom()
        align = cWidth >= right ? 'start' : 'end'
      },

      // ===== BOTTOM 系 =====
      bottom: () => {
        setBottom()
        align = alignTopBottomCenter()
      },
      'bottom-start': () => {
        setBottom()
        align = 'start'
      },
      'bottom-end': () => {
        setBottom()
        align = cWidth >= right ? 'start' : 'end'
      },

      // ===== LEFT 系 =====
      left: () => {
        setLeftOrRightFromLeft()
        align = alignLeftRightCenter()
      },
      'left-start': () => {
        setLeftOrRightFromLeft()
        align = 'start'
      },
      'left-end': () => {
        setLeftOrRightFromLeft()
        align = cHeight >= bottom ? 'start' : 'end'
      },

      // ===== RIGHT 系 =====
      right: () => {
        setRight()
        align = alignLeftRightCenter()
      },
      'right-start': () => {
        setRight()
        align = 'start'
      },
      'right-end': () => {
        setRight()
        align = cHeight >= bottom ? 'start' : 'end'
      },
    }
    map[placement]()
  }
  finalPlace(placement)
  currentPlacement.value = finalP
  currentAlign.value = align
  arrowPosition.value = new ArrowPosition()

  // 计算时需要补充当前视口滚动的量
  const topWidthWinY = top + window.scrollY
  const bottomWidthWinY = bottom + window.scrollY

  if (finalP === 'top') {
    contentOffset.value.top = topWidthWinY - cHeight - TRIGGER_GAP
    arrowPosition.value.bottom = -arrowHeight / 2
    if (align === 'start') {
      contentOffset.value.left = left
      arrowPosition.value.left = tWidth / 2 - arrowWidth / 2
    } else if (align === 'end') {
      contentOffset.value.left = right - cWidth
      arrowPosition.value.right = tWidth / 2 - arrowWidth / 2
    } else {
      contentOffset.value.left = left + (tWidth - cWidth) / 2
      arrowPosition.value.left = cWidth / 2 - arrowWidth / 2
    }
    return
  }

  if (finalP === 'bottom') {
    contentOffset.value.top = bottomWidthWinY + TRIGGER_GAP
    arrowPosition.value.top = -arrowHeight / 2
    if (align === 'start') {
      contentOffset.value.left = left
      arrowPosition.value.left = tWidth / 2 - arrowWidth / 2
    } else if (align === 'end') {
      contentOffset.value.left = right - cWidth
      arrowPosition.value.right = tWidth / 2 - arrowWidth / 2
    } else {
      contentOffset.value.left = left + (tWidth - cWidth) / 2
      arrowPosition.value.left = cWidth / 2 - arrowWidth / 2
    }
    return
  }

  if (finalP === 'left') {
    contentOffset.value.left = left - cWidth - TRIGGER_GAP
    arrowPosition.value.right = -arrowWidth / 2
    if (align === 'start') {
      contentOffset.value.top = bottomWidthWinY - cHeight
      arrowPosition.value.top = tHeight / 2 - arrowHeight / 2
    } else if (align === 'end') {
      contentOffset.value.top = topWidthWinY
      arrowPosition.value.bottom = tHeight / 2 - arrowHeight / 2
    } else {
      contentOffset.value.top = topWidthWinY + (tHeight - cHeight) / 2
      arrowPosition.value.top = cHeight / 2 - arrowHeight / 2
    }
    return
  }

  if (finalP === 'right') {
    contentOffset.value.left = right + TRIGGER_GAP
    arrowPosition.value.left = -arrowWidth / 2
    if (align === 'start') {
      contentOffset.value.top = bottomWidthWinY - cHeight
      arrowPosition.value.top = tHeight / 2 - arrowHeight / 2
    } else if (align === 'end') {
      contentOffset.value.top = topWidthWinY
      arrowPosition.value.bottom = tHeight / 2 - arrowHeight / 2
    } else {
      contentOffset.value.top = topWidthWinY + (tHeight - cHeight) / 2
      arrowPosition.value.top = cHeight / 2 - arrowHeight / 2
    }
  }
}


/**
 * 计算手动定位时的位移
 */
export function calcOffsetInManual(
  x: number,
  y: number,
  placement: placementType,
  contentEl: HTMLElement | null,
  arrowEl: HTMLElement | null,
  contentOffset: Ref<ContentOffset>,
  arrowPosition: Ref<ArrowPosition>,
){
  if(!contentEl) return
  const cWidth = contentEl.offsetWidth
  const cHeight = contentEl.offsetHeight

  // 箭头的宽高
  const arrowWidth = arrowEl?.offsetWidth ?? 0
  const arrowHeight = arrowEl?.offsetHeight ?? 0

  let finalX: number = 0
  let finalY: number = 0
  const halfCWidth = cWidth / 2
  const halfCHeight = cHeight / 2
  const map: Record<placementType, () => void> = {
    // ===== TOP 系 =====
    top: () => {
      finalX = halfCWidth > vWidth - x ? x - cWidth : ( halfCWidth > x ? x : x - halfCWidth)
      finalY = cHeight + arrowHeight > y ? y : y - (cHeight + arrowHeight)
    },
    'top-start': () => {
      finalX = cWidth > vWidth - x ? x - cWidth : x
      finalY = cHeight + arrowHeight > y ? y : y - (cHeight + arrowHeight)
    },
    'top-end': () => {
      finalX = cWidth > x ? x : x - cWidth
      finalY = cHeight + arrowHeight > y ? y : y - (cHeight + arrowHeight)
    },

    // ===== BOTTOM 系 =====
    bottom: () => {
      finalX = halfCWidth > vWidth - x ? x - cWidth : ( halfCWidth > x ? x : x - halfCWidth)
      finalY = cHeight + arrowHeight > vHeight - y ? y - (cHeight + arrowHeight) : y
    },
    'bottom-start': () => {
      finalX = cWidth > vWidth - x ? x - cWidth : x
      finalY = cHeight + arrowHeight > vHeight - y ? y - (cHeight + arrowHeight) : y
    },
    'bottom-end': () => {
      finalX = cWidth > x ? x : x - cWidth
      finalY = cHeight + arrowHeight > vHeight - y ? y - (cHeight + arrowHeight) : y
    },

    // ===== LEFT 系 =====
    left: () => {
      finalX = cWidth + arrowWidth > x ? x : x - (cWidth + arrowWidth)
      finalY = halfCHeight > y ? y : ( halfCHeight > vHeight - y ? y - cHeight : y - halfCHeight )
    },
    'left-start': () => {
      finalX = cWidth + arrowWidth > x ? x : x - (cWidth + arrowWidth)
      finalY = cHeight > vHeight - y ? y - cHeight : y 
    },
    'left-end': () => {
      finalX = cWidth + arrowWidth > x ? x : x - (cWidth + arrowWidth)
      finalY = cHeight > y ? y : y - cHeight
    },

    // ===== RIGHT 系 =====
    right: () => {
      finalX = cWidth + arrowWidth > vWidth - x ? x - (cWidth + arrowWidth) : x
      finalY = halfCHeight > y ? y : ( halfCHeight > vHeight - y ? y - cHeight : y - halfCHeight )
    },
    'right-start': () => {
      finalX = cWidth + arrowWidth > vWidth - x ? x - (cWidth + arrowWidth) : x
      finalY = cHeight > vHeight - y ? y - cHeight : y 
    },
    'right-end': () => {
      finalX = cWidth + arrowWidth > vWidth - x ? x - (cWidth + arrowWidth) : x
      finalY = cHeight > y ? y : y - cHeight
    },
  }
  map[placement]()
  contentOffset.value.left = finalX
  contentOffset.value.top = finalY
}