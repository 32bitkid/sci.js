import type { BitReader } from '@4bitlabs/readers';
import { type Vec2, type MutableVec2, set } from '@4bitlabs/vec2';

// getPoint24 gets reads an absolute position from the
// bit-stream. The format is 24-bits long:
//
// bits  |
//  0-3  | high nybble of x-position
//  4-7  | high nybble of y-position
//  8-15 | low byte of x-position
// 16-23 | low byte of y-position
//
export function getPoint24(br: BitReader, out: MutableVec2): MutableVec2 {
  const code = br.read32(24);
  const x = ((code & 0xf00000) >>> 12) | ((code & 0xff00) >>> 8);
  const y = ((code & 0x0f0000) >>> 8) | ((code & 0x00ff) >>> 0);
  return set(x, y, out);
}

// getPoint16 reads a medium length delta from the bit-stream.
// The total PayloadBytes is 16-bits long:
//
// bits |
// 0-7  | y-delta
// 8-15 | x-delta
//
export function getPoint16(
  br: BitReader,
  out: MutableVec2,
  ref: Readonly<Vec2>,
): MutableVec2 {
  const y = br.read32(8);
  const absY = y & 0b0111_1111;
  const dy = (y & 0b1000_0000) !== 0 ? -absY : absY;

  const x = br.read32(8);
  const dx = x > 0b0111_1111 ? x - 256 : x;

  return set(ref[0] + dx, ref[1] + dy, out);
}

// getPoint8 reads a medium length delta from the bit-stream.
// The total PayloadBytes is 8-bits long:
//
// bits |
// 0-3  | y-delta
// 4-7  | x-delta
//
export function getPoint8(
  br: BitReader,
  out: MutableVec2,
  ref: Readonly<Vec2>,
): MutableVec2 {
  const code = br.read32(8);

  const xSign = ((code >>> 4) & 0b1000) !== 0;
  const ySign = ((code >>> 0) & 0b1000) !== 0;
  const dx = (code >>> 4) & 0b111;
  const dy = (code >>> 0) & 0b111;

  return set(ref[0] + (xSign ? -dx : dx), ref[1] + (ySign ? -dy : dy), out);
}
