import { applyToPoints, Matrix } from 'transformation-matrix';

import { FillCommand, PolylineCommand } from '@4bitlabs/sci0';

export const drawFILL = (
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  matrix: Matrix,
  cmd: FillCommand,
) => {
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
};

export const drawPLINE = (
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  matrix: Matrix,
  cmd: PolylineCommand,
) => {
  const [, , , ...points] = cmd;
  const all = applyToPoints(
    matrix,
    points.map(([x, y]) => [x + 0.5, y + 0.5]),
  );

  {
    ctx.beginPath();
    const [first, ...rest] = all;
    ctx.moveTo(...first);
    rest.forEach(([x, y]) => ctx.lineTo(x, y));

    ctx.stroke();
  }

  all.forEach(([x, y]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.roundRect(-3, -3, 6, 6, 0.5);
    ctx.stroke();
    ctx.restore();
  });
};
