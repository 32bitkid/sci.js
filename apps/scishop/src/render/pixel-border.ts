import { type Vec2 } from '@4bitlabs/vec2';
import { areaOfPolygon, pathPoly } from '../helpers/polygons.ts';
import * as SmoothStep from '../helpers/smoothstep.ts';

export function pixelBorder(
  ctx: CanvasRenderingContext2D,
  points: Readonly<Vec2>[],
) {
  ctx.save();
  pathPoly(ctx, points);

  ctx.lineWidth = 1;
  ctx.setLineDash([1, 1]);
  ctx.strokeStyle = 'white';

  const area = areaOfPolygon(points);
  const alpha = SmoothStep.s1(1, 6 * 6, area);
  ctx.strokeStyle = `oklab(${(alpha * 100).toFixed(0)}% 0 0)`;
  ctx.fillStyle = `oklab(${(alpha * 100 * 0.45).toFixed(0)}% 0 0)`;

  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
