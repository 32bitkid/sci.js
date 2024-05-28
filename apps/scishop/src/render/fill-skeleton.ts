import { applyToPoints, Matrix } from 'transformation-matrix';

import { FillCommand } from '@4bitlabs/sci0';

export function fillSkeleton(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  matrix: Matrix,
  cmd: FillCommand,
) {
  const [, , , ...points] = cmd;
  const all = applyToPoints(
    matrix,
    points.map(([x, y]) => [x + 0.5, y + 0.5]),
  );

  all.forEach(([x, y]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(3, 0);
    ctx.lineTo(0, -4);
    ctx.lineTo(-3, 0);
    ctx.lineTo(0, 4);
    ctx.lineTo(3, 0);
    ctx.stroke();
    ctx.restore();
  });
}
