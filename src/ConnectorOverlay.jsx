import React, { useLayoutEffect, useRef, useState } from "react";

const RADIUS = 12;  // ←★ elbow corner radius

/**
 * Absolute‑positioned SVG that draws an orthogonal elbow connector
 * between every node and its parent.  It is completely presentation‑only:
 * no state mutations, no DOM queries inside <Tree>.
 */
export default function ConnectorOverlay({ treeData, nodeRefs, containerRef, gap }) {
  const GAP = gap ?? 12;  // ←★ use prop or fallback to 12
  const [paths, setPaths] = useState([]);
  const raf = useRef(null);

  const update = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const cRect = containerRef.current.getBoundingClientRect();
      const next = [];

      treeData.forEach((n) => {
        if (n.parent === 0) return;                     // root has no parent line
        const childEl  = nodeRefs.current[n.id];
        const parentEl = nodeRefs.current[n.parent];
        if (!childEl || !parentEl) return;              // collapsed branch

        const cr = childEl.getBoundingClientRect();
        const pr = parentEl.getBoundingClientRect();

        // Column sits GAP px left of the card border, vertically centred
        const colX  = cr.left - cRect.left - GAP;
        const cY    = cr.top  - cRect.top  + cr.height / 2;
        const pY    = pr.top  - cRect.top  + pr.height / 2;

        /*  Rounded orthogonal path:
         *  parent ⬇︎ to radius‑before‑child ⤵︎ quarter‑circle ⟶ to child
         */
        const d =
          pY < cY
            ? // child is below parent
              `M ${colX} ${pY}
               V ${cY - RADIUS}
               Q ${colX} ${cY} ${colX + RADIUS} ${cY}
               H ${colX + GAP}`
            : // child is above parent (rare but covers drag edge‑case)
              `M ${colX} ${pY}
               V ${cY + RADIUS}
               Q ${colX} ${cY} ${colX + RADIUS} ${cY}
               H ${colX + GAP}`;

        next.push({ d: d.replace(/\s+/g, " ") });
      });

      setPaths(next);
    });
  };

  useLayoutEffect(update, [treeData]);            // redraw when nodes array mutates

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    Object.values(nodeRefs.current).forEach((el) => el && ro.observe(el));
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [treeData, nodeRefs, containerRef]);

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {paths.map(({ d }, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#DFDFE2"
          strokeWidth="2"
          strokeLinecap="round"
          shapeRendering="geometricPrecision"
        />
      ))}
    </svg>
  );
}
