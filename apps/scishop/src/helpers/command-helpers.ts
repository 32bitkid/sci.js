import {
  BrushCommand,
  DrawCommand,
  FillCommand,
  PolylineCommand,
} from '@4bitlabs/sci0';
import { squaredDistanceBetween, Vec2 } from '@4bitlabs/vec2';
import { insert } from './array-helpers.ts';
import { exhaustive } from './exhaustive.ts';

export const extractCoordinates = (
  cmd: PolylineCommand | FillCommand | BrushCommand,
): Vec2[] => {
  const [type] = cmd;
  switch (type) {
    case 'PLINE': {
      const [, , , ...vertices] = cmd;
      return vertices;
    }
    case 'FILL': {
      const [, , , vertex] = cmd;
      return [vertex];
    }
    case 'BRUSH': {
      const [, , , , , vertex] = cmd;
      return [vertex];
    }
    default:
      exhaustive(`unexpected type`, type);
  }
};

export type ClosestPointState = [dSqrd: number, idx: number];
export const findClosestPointTo = (
  vertices: Readonly<Vec2>[],
  position: Readonly<Vec2>,
  initial: ClosestPointState = [Infinity, NaN],
): ClosestPointState =>
  vertices.reduce<ClosestPointState>((state, point, pIdx) => {
    const [prevD2] = state;
    const thisD2 = squaredDistanceBetween(position, point);
    return thisD2 < prevD2 ? [thisD2, pIdx] : state;
  }, initial);

export type FindState = [dSqrd: number, commandIdx: number, pointIdx: number];
export const findClosestPointIn = (
  commands: DrawCommand[],
  position: Readonly<Vec2>,
): FindState =>
  commands.reduce<FindState>(
    (state, cmd, cmdIdx) => {
      const [type] = cmd;
      if (type !== 'PLINE' && type !== 'FILL') return state;
      const [prevD2] = state;
      const [nextD2, pIdx] = findClosestPointTo(
        extractCoordinates(cmd).map(([x, y]) => [x + 0.5, y + 0.5]),
        position,
      );
      return nextD2 < prevD2 ? [nextD2, cmdIdx, pIdx] : state;
    },
    [Infinity, NaN, NaN],
  );

export type FindResult = [commandIdx: number, pointIdx: number];
export function nearestPointWithRange(
  commands: DrawCommand[],
  position: Readonly<Vec2>,
  range: number,
): FindResult | null {
  const result = findClosestPointIn(commands, position);

  const [distSqrd, ...rest] = result;
  if (!Number.isFinite(distSqrd)) return null;

  const dist = Math.sqrt(distSqrd);
  if (dist > range) return null;

  return rest;
}

export const moveLineVertex = (
  [type, mode, codes, ...verts]: PolylineCommand,
  idx: number,
  pos: [number, number],
): PolylineCommand => [type, mode, codes, ...insert(verts, idx, pos, true)];

export const moveFillVertex = (
  [type, mode, codes]: FillCommand,
  pos: [number, number],
): FillCommand => [type, mode, codes, pos];
