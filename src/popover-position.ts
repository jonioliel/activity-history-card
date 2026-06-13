export interface RectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ViewportLike {
  width: number;
  height: number;
}

export interface PopoverPoint {
  x: number;
  y: number;
  placement: "floating" | "bottom";
}

export function positionPopover(anchor: RectLike, viewport: ViewportLike, popoverWidth = 320, popoverHeight = 220): PopoverPoint {
  if (viewport.width <= 640) {
    return { x: 12, y: Math.max(12, viewport.height - popoverHeight - 12), placement: "bottom" };
  }

  const margin = 16;
  const rawX = anchor.left + anchor.width / 2 - popoverWidth / 2;
  const rawY = anchor.top + anchor.height + 12;
  const x = clamp(rawX, margin, viewport.width - popoverWidth - margin);
  const y = clamp(rawY, margin, viewport.height - popoverHeight - margin);
  return { x, y, placement: "floating" };
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(max, Math.max(min, value));
}
