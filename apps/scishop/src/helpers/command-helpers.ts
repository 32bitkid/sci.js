import {
  DrawCommandStruct,
  DrawCommand,
  FillCommand,
  PolylineCommand,
} from '@4bitlabs/sci0';
import {
  distanceBetween,
  project,
  squaredDistanceBetween,
  Vec2,
} from '@4bitlabs/vec2';
import { insert } from './array-helpers.ts';
import { getSegments } from './polygons.ts';

export const extractVertices = (
  cmd: DrawCommandStruct<string, unknown, Vec2[]>,
): Vec2[] => {
  const [type] = cmd;
  switch (type) {
    case 'PLINE': {
      const [, , ...vertices] = cmd;
      return vertices;
    }
    case 'BRUSH':
    case 'FILL': {
      const [, , vertex] = cmd;
      return [vertex];
    }
    default:
      return [];
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
        extractVertices(cmd).map(([x, y]) => [x + 0.5, y + 0.5]),
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
  [type, options, ...verts]: PolylineCommand,
  idx: number,
  pos: [number, number],
): PolylineCommand => [type, options, ...insert(verts, idx, pos, true)];

export const moveFillVertex = (
  [type, options]: FillCommand,
  pos: [number, number],
): FillCommand => [type, options, pos];

export type PointAlongPathResult = [
  cmdIdx: number,
  i0: number,
  i1: number,
  point: Vec2,
];
export function pointAlongPaths(
  commands: DrawCommand[],
  position: Readonly<Vec2>,
  range: number,
): PointAlongPathResult | null {
  for (let cmdIdx = 0; cmdIdx < commands.length; cmdIdx++) {
    const cmd = commands[cmdIdx];
    const [type] = cmd;
    if (type !== 'PLINE') continue;

    const points = extractVertices(cmd).map<Vec2>(([x, y]) => [
      x + 0.5,
      y + 0.5,
    ]);
    for (const segment of getSegments(points)) {
      const [i0, i1, v0, v1] = segment;
      const p = project(v0, v1, position);
      const dist = distanceBetween(p, position);
      if (dist < range) {
        return [cmdIdx, i0, i1, p];
      }
    }
  }

  return null;
}

export function getVertexFrom(
  commands: DrawCommand[],
  cmdIdx: number,
  vertexIdx: number,
) {
  const cmd = commands[cmdIdx];
  if (!cmd) return null;
  const [type] = cmd;
  if (type !== 'PLINE' && type !== 'FILL') return null;
  const points = extractVertices(cmd);
  return points[vertexIdx];
}

export function mustGetVertexFrom(
  commands: DrawCommand[],
  cmdIdx: number,
  vertexIdx: number,
) {
  const result = getVertexFrom(commands, cmdIdx, vertexIdx);
  if (!result)
    throw new Error(`Command does not contain [${cmdIdx}/${vertexIdx}]`);
  return result;
}
