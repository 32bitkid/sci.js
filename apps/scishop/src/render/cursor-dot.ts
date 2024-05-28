import { Vec2 } from '../helpers/vec2-helpers.ts';

export function cursorDot(
  ctx: CanvasRenderingContext2D,
  [x, y]: Vec2,
  size = 2,
) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();

  ctx.restore();
}
