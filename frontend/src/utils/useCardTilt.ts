import { useEffect } from 'react';

/**
 * useCardTilt — real-time pointer-tracked 3D tilt for all cards.
 * Targets .card-tilt, .card-tilt-subtle, .card classes.
 * Uses requestAnimationFrame for 60fps smooth motion.
 * Anti-blur: GPU layer pre-allocated via CSS. JS only updates transform inline.
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
        const maxTilt = isSubtle ? 5 : isKpiCard ? 5 : 7;

        activeCard.style.transform = `perspective(${perspective}) rotateX(${pendingX.toFixed(2)}deg) rotateY(${pendingY.toFixed(2)}deg) translateY(-8px) translateZ(12px)`;
        activeCard.style.transition = 'transform 0.05s linear, box-shadow 0.35s ease, border-color 0.35s ease';
      }
      rafId = null;
    }

    function onPointerMove(e: PointerEvent) {
      const el = (e.target as HTMLElement)?.closest?.('.card-tilt, .card-tilt-subtle, .card') as HTMLElement | null;

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
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      const normX = (relX / rect.width) * 2 - 1;   // -1 to +1
      const normY = (relY / rect.height) * 2 - 1;  // -1 to +1

      const isSubtle = el.classList.contains('card-tilt-subtle');
      const isKpiCard = el.classList.contains('card') && !el.classList.contains('card-tilt');
      const maxTilt = isSubtle ? 5 : isKpiCard ? 5 : 7;

      // rotateX: cursor top → tilt away (negative), cursor bottom → tilt toward (positive)
      // rotateY: cursor left → tilt away (-), cursor right → tilt toward (+)
      pendingX = -(normY * maxTilt);
      pendingY = normX * maxTilt;

      if (!rafId) {
        rafId = requestAnimationFrame(applyTilt);
      }
    }

    function resetCard(card: HTMLElement) {
      card.style.transform = '';
      card.style.transition = '';
    }

    function onPointerLeave(e: PointerEvent) {
      // Only reset if pointer actually left the window
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || related === document.documentElement) {
        if (activeCard) resetCard(activeCard);
        activeCard = null;
      }
    }

    // Handle card-level pointer leave
    function onCardLeave(e: PointerEvent) {
      const card = (e.currentTarget as HTMLElement);
      // Only reset if not entering a child
      if (card === activeCard) {
        const to = e.relatedTarget as HTMLElement | null;
        if (!to || !card.contains(to)) {
          resetCard(card);
          activeCard = null;
          if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        }
      }
    }

    // Global card pointerleave delegation via event bubbling
    function onDocPointerLeave(e: PointerEvent) {
      const card = (e.target as HTMLElement)?.closest?.('.card-tilt, .card-tilt-subtle, .card') as HTMLElement | null;
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
    document.addEventListener('pointerleave', onDocPointerLeave as EventListener, { passive: true, capture: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onDocPointerLeave as EventListener, { capture: true });
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}
