import { Ref } from 'vue'
import type { triggerType } from './popover'

interface PopoverStates {
  visible: Ref<boolean>
  trigger: Ref<triggerType>
}


/**
 * 
 * @param dialogEl 弹出层 dom 节点
 * @param visible 弹出层显隐状态响应值
 * @returns 
 */
export function useFocusTrap(dialogEl: HTMLElement, states: PopoverStates) {
  let lastFocusedEl: HTMLElement | null = null;

  // 获取弹窗内部可聚焦元素
  const getFocusable = (): HTMLElement[] => {
    return Array.from(
      dialogEl.querySelectorAll<HTMLElement>(
        `
        a[href],
        area[href],
        button:not([disabled]),
        input:not([disabled]),
        select:not([disabled]),
        textarea:not([disabled]),
        iframe,
        object,
        embed,
        [tabindex]:not([tabindex="-1"]),
        [contenteditable]
      `
      )
    );
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if(e.key === "Escape"){
      // 控制状态改变
      states.visible.value = false
      return
    }
    if (e.key !== "Tab") return;

    const focusable = getFocusable();
    if (focusable.length === 0) return;

    const first = focusable[0]; // 第一个可聚焦元素
    const last = focusable[focusable.length - 1]; // 最后一个可聚焦元素

    if (!dialogEl.contains(document.activeElement)) {
      // 强制进入弹窗的第一个可聚焦元素
      first.focus();
      e.preventDefault();
      return;
    }

    if (e.shiftKey) {
      // shift + tab 代表回退到上一个可聚焦元素的逻辑
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  };

  const activate = (autoFocus: Boolean = false) => {
    lastFocusedEl = document.activeElement as HTMLElement | null; // 记录之前的焦点
    document.addEventListener("keydown", handleKeydown);

    // 下一帧聚焦弹窗内部第一个元素
    setTimeout(() => {
      const focusable = getFocusable();
      if (focusable.length && autoFocus) {
        focusable[0].focus();
      }
    });
  };

  const deactivate = () => {
    document.removeEventListener("keydown", handleKeydown);
    lastFocusedEl?.focus(); // 恢复之前焦点
  };

  return { activate, deactivate };
}
