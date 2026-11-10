declare module 'virtual:sy-icon-set' {
  export const ICONS: Record<string, unknown>;
  export function symbol(id: string, icon: unknown, styleId?: string): { defs: string; sym: string };
}

declare module 'virtual:sy-icon-motion' {
  export const MOTION: Record<string, unknown>;
  export function animateIcon(svg: SVGSVGElement, id: string, trigger?: Element): void;
}
