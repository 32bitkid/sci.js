import { applyToPoints, Matrix } from 'transformation-matrix';

import { PolylineCommand } from '@4bitlabs/sci0';

export function plineSkeleton(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  matrix: Matrix,
  cmd: PolylineCommand,
  highlights: number[] = [],
) {
  ctx.save();

  const [, , , ...cPoints] = cmd;
  const points = applyToPoints(
    matrix,
    cPoints.map(([x, y]) => [x + 0.5, y + 0.5]),
  );

  ctx.lineWidth = 1;
  ctx.beginPath();
  points.forEach(([x, y], idx) => ctx[idx ? 'lineTo' : 'moveTo'](x, y));
  ctx.stroke();

  ctx.lineWidth = 1.5;
  points.forEach(([x, y], idx) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.clearRect(-2, -2, 4, 4);
    ctx.roundRect(-2.5, -2.5, 5, 5, 0.5);
    ctx.stroke();
    if (highlights.includes(idx)) ctx.fill();
    ctx.restore();
  });

  ctx.restore();
}
