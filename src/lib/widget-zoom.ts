/* Reapply on every load. A reload replaces the document and drops the zoom. */
function applyZoom(frame: HTMLIFrameElement) {
  try {
    const root = frame.contentDocument?.documentElement;
    if (root) root.style.zoom = frame.dataset.zoom ?? '';
  } catch {}
}

for (const frame of document.querySelectorAll<HTMLIFrameElement>('.wpv__card iframe[data-zoom]')) {
  frame.addEventListener('load', () => applyZoom(frame));
  applyZoom(frame);
}
