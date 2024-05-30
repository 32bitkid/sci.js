import { Vec2 } from '@4bitlabs/vec2';

export function cursorDot(
  ctx: CanvasRenderingContext2D,
  [x, y]: Readonly<Vec2>,
  size = 2,
) {
  ctx.save();

  ctx.translate(x, y);

  ctx.beginPath();
  ctx.arc(0, 0, size * 1.75, 0, Math.PI * 2);
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0 0 0 / 20%)';
  ctx.fill('evenodd');

  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255 255 255 / 40%)';
  ctx.fill();

  ctx.restore();
}
