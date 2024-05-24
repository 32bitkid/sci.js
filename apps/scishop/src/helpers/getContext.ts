type Canvas = HTMLCanvasElement | OffscreenCanvas;
type Context = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
const cache = new WeakMap<Canvas, Context>();

export function get2dContext(
  el: OffscreenCanvas,
): OffscreenCanvasRenderingContext2D;
export function get2dContext(el: HTMLCanvasElement): CanvasRenderingContext2D;
export function get2dContext(el: Canvas): Context {
  // TODO This might be no better than just calling getContext() again and letting *it* return the context
  const cachedCtx = cache.get(el);
  if (cachedCtx) return cachedCtx;

  const ctx = el.getContext('2d');
  if (!ctx) throw new Error('cannot establish new canvas context');
  cache.set(el, ctx);
  return ctx;
}
