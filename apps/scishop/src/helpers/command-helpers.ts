import { FillCommand, PolylineCommand } from '@4bitlabs/sci0';
import { EditorCommand } from '../models/EditorCommand.ts';
import { distanceSquared, Vec2 } from './vec2-helpers.ts';
import { insert } from './array-helpers.ts';

export type FindResult = [cIdx: number, pIdx: number, x: number, y: number];

type FindState = [d: number, cIdx: number, pIdx: number, x: number, y: number];

export function findClosestPoint(
  layer: EditorCommand,
  position: Vec2,
  range: number,
): FindResult | null {
  const result = layer.commands.reduce<FindState>(
    ($state, cmd, cmdIdx) => {
      const [type] = cmd;
      if (type !== 'PLINE' && type !== 'FILL') return $state;
      const [, , , ...coords] = cmd;
      return coords.reduce<FindState>((state, [x, y], pIdx) => {
        const [pDist2, ,] = state;
        const dist2 = distanceSquared(position, [x + 0.5, y + 0.5]);
        return dist2 < pDist2 ? [dist2, cmdIdx, pIdx, x, y] : state;
      }, $state);
    },
    [Infinity, NaN, NaN, NaN, NaN],
  );

  const [distSqrd, ...rest] = result;
  if (!Number.isFinite(distSqrd)) return null;

  const dist = Math.sqrt(distSqrd);
  if (dist > range) return null;
  return rest;
}

export function moveLineVertex(
  source: PolylineCommand,
  idx: number,
  pos: [number, number],
): PolylineCommand {
  const [type, mode, codes, ...verts] = source;
  return [type, mode, codes, ...insert(verts, idx, pos, true)];
}

export function moveFillVertex(
  source: FillCommand,
  pos: [number, number],
): FillCommand {
  const [type, mode, codes] = source;
  return [type, mode, codes, pos];
}
