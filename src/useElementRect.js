import { useState, useLayoutEffect } from "react";

/**
 * Track a DOM element's bounding rect in real time, using ResizeObserver.
 * Adds scroll / resize listeners so the value stays fresh while the user drags
 * or the window moves.
 */
export function useElementRect(ref) {
  const [rect, setRect] = useState(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const update = () => setRect(ref.current.getBoundingClientRect());

    update();                                   // initial
    const ro = new ResizeObserver(update);      
    ro.observe(ref.current);                    // element resize
    window.addEventListener("scroll", update, true); // any scroll container
    window.addEventListener("resize", update);        // viewport resize

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return rect;
}
