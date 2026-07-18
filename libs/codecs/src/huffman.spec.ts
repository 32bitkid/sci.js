import { describe, expect, it } from 'vitest';

import { unpack } from './huffman.js';

describe('huffman compression', () => {
  /*
   * Tree layout used by most tests:
   *
   *   Node 0: siblings=0x10
   *     bit 0 → next=1 → Node 1 (leaf)
   *     bit 1 → next=0 → literal read (8 bits)
   *
   *   Node 1: leaf
   */

  it('should unpack a single leaf value', () => {
    // Stream: 0 (→ leaf 'A'), 1+0xFF (→ literal terminal)
    // biome-ignore format: byte-stream formatting
    const data = Uint8Array.of(
      0x02, 0xff,             // nodeCount=2, terminal=0xFF
      0x00, 0x10, 0x41, 0x00, // node 0: [0x00, 0x10], node 1: [0x41, 0x00]
      0x7f, 0xc0,             // bits: 0_1_11111111
    );
    const result = unpack(data);
    expect(result).toStrictEqual(Uint8Array.of(0x41));
  });

  it('should unpack repeated leaf values', () => {
    // Stream: 0,0,0 (→ leaf 'A' ×3), 1+0xFF (→ terminal)
    // biome-ignore format: byte-stream formatting
    const data = Uint8Array.of(
      0x02, 0xff,             // nodeCount=2, terminal=0xFF
      0x00, 0x10, 0x41, 0x00, // node 0: [0x00, 0x10], node 1: [0x41, 0x00]
      0x1f, 0xf0,             // bits: 000_1_11111111
    );
    const result = unpack(data);
    expect(result).toStrictEqual(Uint8Array.of(0x41, 0x41, 0x41));
  });

  it('should unpack literal values that are not the terminal', () => {
    // Node 0: bit 0 → literal, bit 1 → node 1 (leaf 'B')
    // Stream: 1 (→ leaf 'B'), 0+0x41 (→ literal 'A'), 0+0xFF (→ terminal)
    // biome-ignore format: byte-stream formatting
    const data = Uint8Array.of(
      0x02, 0xff,             // nodeCount=2, terminal=0xFF
      0x00, 0x01, 0x42, 0x00, // node 0: [0x00, 0x01], node 1: [0x42, 0x00]
      0x90, 0x5f, 0xe0,       // bits: 1_0_01000001_0_11111111
    );
    const result = unpack(data);
    expect(result).toStrictEqual(Uint8Array.of(0x42, 0x41));
  });

  it('should unpack to empty when terminal is immediate', () => {
    // Node 0: bit 0 → literal, bit 1 → node 1
    // Stream: 0+0xFF (→ literal terminal immediately)
    // biome-ignore format: byte-stream formatting
    const data = Uint8Array.of(
      0x02, 0xff,             // nodeCount=2, terminal=0xFF
      0x00, 0x01, 0x41, 0x00, // node 0: [0x00, 0x01], node 1: [0x41, 0x00]
      0x7f, 0x80,             // bits: 0_11111111
    );
    const result = unpack(data);
    expect(result).toStrictEqual(Uint8Array.of());
  });

  it('should handle a deeper tree', () => {
    // Node 0: siblings=0x12 → bit 0 → next=1 (leaf 'A'), bit 1 → next=2
    // Node 1: leaf 'A'
    // Node 2: siblings=0x01 → bit 0 → literal, bit 1 → next=1 → node 3 (leaf 'C')
    // Node 3: leaf 'C'
    //
    // Codes: 0 → 'A', 11 → 'C', 10 → literal
    // Stream: 0 (A), 11 (C), 10+0x42 (literal 'B'), 0 (A), 10+0xFF (terminal)
    // biome-ignore format: byte-stream formatting
    const data = Uint8Array.of(
      0x04, 0xff,                         // nodeCount=4, terminal=0xFF
      0x00, 0x12, 0x41, 0x00,             // node 0: [0x00, 0x12], node 1: [0x41, 0x00]
      0x00, 0x01, 0x43, 0x00,             // node 2: [0x00, 0x01], node 3: [0x43, 0x00]
      0x72, 0x12, 0xff,                   // bits: 0_11_10_01000010_0_10_11111111
    );
    const result = unpack(data);
    expect(result).toStrictEqual(Uint8Array.of(0x41, 0x43, 0x42, 0x41));
  });

  it('should not terminate on a leaf whose value matches the terminal', () => {
    // Node 1 is a leaf with value=0xFF, same as the terminal.
    // Leaf nodes return ok=false, so they must NOT trigger termination.
    // Stream: 0 (→ leaf 0xFF, ok=false → push), 1+0xFF (→ literal 0xFF, ok=true → stop)
    // biome-ignore format: byte-stream formatting
    const data = Uint8Array.of(
      0x02, 0xff,             // nodeCount=2, terminal=0xFF
      0x00, 0x10, 0xff, 0x00, // node 0: [0x00, 0x10], node 1: [0xFF, 0x00]
      0x7f, 0xc0,             // bits: 0_1_11111111
    );
    const result = unpack(data);
    expect(result).toStrictEqual(Uint8Array.of(0xff));
  });

  it('should handle non-ascii byte values', () => {
    // Stream: 0 (→ leaf 0xAB), 0 (→ leaf 0xAB), 1+0xCD (→ literal), 1+0xFF (→ terminal)
    // biome-ignore format: byte-stream formatting
    const data = Uint8Array.of(
      0x02, 0xff,             // nodeCount=2, terminal=0xFF
      0x00, 0x10, 0xab, 0x00, // node 0: [0x00, 0x10], node 1: [0xAB, 0x00]
      0x39, 0xbf, 0xf0,       // bits: 00_1_11001101_1_11111111
    );
    const result = unpack(data);
    expect(result).toStrictEqual(Uint8Array.of(0xab, 0xab, 0xcd));
  });

  it('should accept Uint8ClampedArray input', () => {
    // biome-ignore format: byte-stream formatting
    const data = new Uint8ClampedArray([
      0x02, 0xff,             // nodeCount=2, terminal=0xFF
      0x00, 0x10, 0x41, 0x00, // node 0: [0x00, 0x10], node 1: [0x41, 0x00]
      0x7f, 0xc0,             // bits: 0_1_11111111
    ]);
    const result = unpack(data);
    expect(result).toStrictEqual(Uint8Array.of(0x41));
  });

  it('should throw on an invalid node reference', () => {
    // Node 0: siblings=0x50 → bit 1 → next=0 (literal), bit 0 → next=5 (does not exist)
    // Stream: 0 (→ next=5 → missing node → error)
    // biome-ignore format: byte-stream formatting
    const data = Uint8Array.of(
      0x02, 0xff,             // nodeCount=2, terminal=0xFF
      0x00, 0x50, 0x41, 0x00, // node 0: [0x00, 0x50], node 1: [0x41, 0x00]
      0x00,                   // bits: 0...
    );
    expect(() => unpack(data)).toThrow(/unexpected huffman code/);
  });
});
