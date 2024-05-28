export type Vec2 = [number, number];

export const vec2 = {
  create(): Vec2 {
    return [0, 0];
  },
  clone(source: Vec2): Vec2 {
    return [source[0], source[1]];
  },
  copy(out: Vec2, a: Vec2): Vec2 {
    out[0] = a[0];
    out[1] = a[1];
    return out;
  },
  set(out: Vec2, x: number, y: number): Vec2 {
    out[0] = x;
    out[1] = y;
    return out;
  },
};
