/* Geometry mirrors the product and must stay in step with it: the design
   canvas from WIDGET_DESIGN, the card width from the 1041px six-column grid,
   WIDGET_HEIGHTS for height, WIDGET_R for the corner, and mountScaledWidget's
   zoom fit in ui/js/utils.js. Changing any of them missizes every preview. */
const DESIGN = { small: [170, 170], medium: [360, 170] } as const;
const CARD_W = { small: 152.67, medium: 330.34 } as const;
export const CARD_H = 150;
export const RADIUS = 28;

export type WidgetSize = keyof typeof DESIGN;

export function widgetFit(size: WidgetSize) {
  const [dw, dh] = DESIGN[size];
  const w = CARD_W[size];
  const fw = Math.round(w);
  const fh = Math.round(CARD_H);
  return {
    w,
    frameStyle: `width:${fw}px;height:${fh}px;transform:translate(${Math.round((w - fw) / 2)}px,${Math.round((CARD_H - fh) / 2)}px);`,
    zoom: String(Math.min(fw / dw, fh / dh)),
  };
}
