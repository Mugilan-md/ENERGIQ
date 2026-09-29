import { useEffect } from 'react';

/**
 * useCardTilt — cursor-tracked premium lift effect, ZERO BLUR.
 *
 * Windows Chromium blurs text/images whenever ANY 3D transform is applied
 * (rotateX, rotateY, rotateZ, translateZ, perspective on self, preserve-3d).
 * This is a browser-level antialiasing mode switch — unavoidable with 3D CSS.
 *
 * Solution: Use ONLY 2D transforms (translateY + scale).
 * The "3D tilt" illusion is simulated via a dynamic directional box-shadow
 * that shifts based on cursor position, creating depth without any 3D rendering.
 */
export function useCardTilt() {
  useEffect(() => {
    let rafId: number | null = null;
    let activeCard: HTMLElement | null = null;
    let pendingX = 0; // cursor normalized -1 to +1 horizontal
    let pendingY = 0; // cursor normalized -1 to +1 vertical

    function applyEffect() {
      if (!activeCard) { rafId = null; return; }

      const isSubtle = activeCard.classList.contains('card-tilt-subtle');
      const isKpi = activeCard.classList.contains('card') && !activeCard.classList.contains('card-tilt');

      // Lift amount
      const liftY = isSubtle ? -7 : isKpi ? -8 : -10;
      const scaleVal = isSubtle ? 1.010 : isKpi ? 1.010 : 1.012;

      // Directional shadow offset based on cursor position (simulates 3D tilt)
      // Shadow offset moves OPPOSITE to cursor direction (light source is "above-left")
      const shadowOffsetX = -(pendingX * 12); // px
      const shadowOffsetY = -(pendingY * 8);  // px

      // Build directional shadow
      const isLight = !activeCard.closest('.bg-slate-900, [class*="bg-slate-9"], [class*="bg-slate-8"]');
      const shadowColor = isSubtle
        ? `rgba(6, 182, 212, 0.14)`
        : `rgba(6, 182, 212, 0.22)`;
      const darkShadow = `rgba(15, 23, 42, 0.30)`;

      activeCard.style.transform = `translateY(${liftY}px) scale(${scaleVal})`;
      activeCard.style.boxShadow = [
        `${shadowOffsetX}px ${28 + shadowOffsetY}px 55px -12px ${shadowColor}`,
        `${shadowOffsetX * 0.5}px ${18}px 36px -8px ${darkShadow}`,
        `0 6px 14px -4px rgba(15, 23, 42, 0.12)`
      ].join(', ');

      if (!isSubtle && !isKpi) {
        activeCard.style.borderColor = 'rgba(99, 102, 241, 0.55)';
      } else if (isSubtle) {
        activeCard.style.borderColor = 'rgba(148, 163, 184, 0.70)';
      }

      activeCard.style.transition =
        'transform 0.08s linear, box-shadow 0.08s linear, border-color 0.32s ease';

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
      pendingX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pendingY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      if (!rafId) {
        rafId = requestAnimationFrame(applyEffect);
      }
    }

    function resetCard(card: HTMLElement) {
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.borderColor = '';
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
