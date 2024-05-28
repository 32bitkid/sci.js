import { applyToPoints, Matrix } from 'transformation-matrix';

import { PolylineCommand } from '@4bitlabs/sci0';

export function plineSkeleton(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  matrix: Matrix,
  cmd: PolylineCommand,
) {
  ctx.save();

  const [, , , ...cPoints] = cmd;
  const points = applyToPoints(
    matrix,
    cPoints.map(([x, y]) => [x + 0.5, y + 0.5]),
  );

  ctx.beginPath();
  points.forEach(([x, y], idx) => ctx[idx ? 'lineTo' : 'moveTo'](x, y));
  ctx.stroke();

  points.forEach(([x, y]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.roundRect(-3, -3, 6, 6, 0.5);
    ctx.stroke();
    ctx.restore();
  });

  ctx.restore();
}
