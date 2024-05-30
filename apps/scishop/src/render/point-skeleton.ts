import { applyToPoint, Matrix } from 'transformation-matrix';

import { Vec2 } from '@4bitlabs/vec2';

export function pointSkeleton(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  matrix: Matrix,
  p: Vec2,
  size = 8,
  fill = true,
) {
  const [x, y] = applyToPoint(matrix, [p[0] + 0.5, p[1] + 0.5]);

  ctx.save();
  ctx.lineWidth = 1.5;
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.clearRect(-((size * 2) / 2), -((size * 2) / 2), size * 2, size * 2);
  ctx.roundRect(-(size / 2), -(size / 2), size, size, 1);
  ctx.stroke();
  if (fill) ctx.fill();
  ctx.restore();
}
