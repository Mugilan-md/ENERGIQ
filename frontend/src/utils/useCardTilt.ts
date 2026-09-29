import { useEffect } from 'react';

/**
 * useCardTilt — real-time pointer-tracked 3D tilt.
 *
 * ANTI-BLUR RULES (Windows Chromium ClearType preservation):
 * 1. NO translateZ in the transform — it creates a new GPU compositing layer
 *    that switches antialiasing from ClearType → grayscale, blurring all text.
 * 2. NO transform-style: preserve-3d on the card — children must stay in 2D.
 * 3. Only use perspective() + rotateX/Y + translateY (no Z axis).
 */
export function useCardTilt() {
  useEffect(() => {
    let rafId: number | null = null;
    let activeCard: HTMLElement | null = null;
    let pendingX = 0;
    let pendingY = 0;

    function applyTilt() {
      if (activeCard) {
        const isSubtle = activeCard.classList.contains('card-tilt-subtle');
        const isKpiCard = activeCard.classList.contains('card') && !activeCard.classList.contains('card-tilt');
        const perspective = isSubtle ? '700px' : '900px';
        const maxTilt = isSubtle ? 4 : isKpiCard ? 4 : 5;
        const liftY = isSubtle ? '-6px' : '-8px';

        // NO translateZ — avoids GPU layer switch that blurs text on Windows
        activeCard.style.transform =
          `perspective(${perspective}) rotateX(${pendingX.toFixed(2)}deg) rotateY(${pendingY.toFixed(2)}deg) translateY(${liftY})`;
        activeCard.style.transition = 'transform 0.05s linear, box-shadow 0.35s ease, border-color 0.35s ease';
      }
      rafId = null;
    }

    function onPointerMove(e: PointerEvent) {
      const el = (e.target as HTMLElement)?.closest?.(
        '.card-tilt, .card-tilt-subtle, .card'
      ) as HTMLElement | null;

      if (!el) {
        if (activeCard) resetCard(activeCard);
        activeCard = null;
        return;
      }

      if (activeCard && activeCard !== el) {
        resetCard(activeCard);
      }
      activeCard = el;

      const rect = el.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;   // -1 to +1
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;  // -1 to +1

      const isSubtle = el.classList.contains('card-tilt-subtle');
      const isKpiCard = el.classList.contains('card') && !el.classList.contains('card-tilt');
      const maxTilt = isSubtle ? 4 : isKpiCard ? 4 : 5;

      pendingX = -(normY * maxTilt);  // top → tilt back, bottom → tilt forward
      pendingY = normX * maxTilt;     // left → tilt left, right → tilt right

      if (!rafId) {
        rafId = requestAnimationFrame(applyTilt);
      }
    }

    function resetCard(card: HTMLElement) {
      card.style.transform = '';
      card.style.transition = '';
    }

    function onDocPointerLeave(e: PointerEvent) {
      const card = (e.target as HTMLElement)?.closest?.(
        '.card-tilt, .card-tilt-subtle, .card'
      ) as HTMLElement | null;

      if (card && card === activeCard) {
        const to = e.relatedTarget as HTMLElement | null;
        if (!to || !card.contains(to)) {
          resetCard(card);
          activeCard = null;
          if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        }
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onDocPointerLeave as EventListener, {
      passive: true,
      capture: true
    });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onDocPointerLeave as EventListener, { capture: true });
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}
