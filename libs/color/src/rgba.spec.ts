import { asTuple } from './rgba';

describe('asTuple', () => {
  it('should convert a rgb object into a tuple', () => {
    expect(asTuple({ r: 0x33, g: 0x66, b: 0x99 })).toEqual([0x33, 0x66, 0x99]);
  });

  it('should convert a rgba object into a tuple', () => {
    expect(asTuple({ r: 0x33, g: 0x66, b: 0x99, a: 0xff })).toEqual([
      0x33, 0x66, 0x99, 0xff,
    ]);
  });

  it('should handle an existing tuple', () => {
    expect(asTuple([0x33, 0x66, 0x99, 0xff])).toEqual([0x33, 0x66, 0x99, 0xff]);
  });
});
