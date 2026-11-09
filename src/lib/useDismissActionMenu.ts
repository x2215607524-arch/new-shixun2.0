import { useEffect } from 'react';

export function useDismissActionMenu(close: (value: null) => void) {
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-action-menu-open="true"]')) {
        close(null);
      }
    };
    // Capture clicks even when other controls stop event propagation.
    document.addEventListener('pointerdown', dismiss, true);
    return () => document.removeEventListener('pointerdown', dismiss, true);
  }, [close]);
}
