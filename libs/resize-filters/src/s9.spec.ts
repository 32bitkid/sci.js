import { s9 } from './s9';

describe('s9', () => {
  it('should handle the middle', () => {
    // biome-ignore format: readability
    const expected = [
      0, 1, 2,
      3, 4, 5,
      6, 7, 8,
    ];

    expect(s9(3, 3, 1, 1)).toEqual(expected);
  });

  it('should handle left side', () => {
    // biome-ignore format: readability
    const expected = [
      3, 0, 1,
      3, 3, 4,
      3, 6, 7
    ];

    expect(s9(3, 3, 0, 1)).toEqual(expected);
  });

  it('should handle right side', () => {
    // biome-ignore format: readability
    const expected = [
      1, 2, 5,
      4, 5, 5,
      7, 8, 5,
    ];

    expect(s9(3, 3, 2, 1)).toEqual(expected);
  });

  it('should handle the top side', () => {
    // biome-ignore format: readability
    const expected = [
      1, 1, 1,
      0, 1, 2,
      3, 4, 5,
    ];

    expect(s9(3, 3, 1, 0)).toEqual(expected);
  });

  it('should handle the bottom side', () => {
    // biome-ignore format: readability
    const expected = [
      3, 4, 5,
      6, 7, 8,
      7, 7, 7,
    ];

    expect(s9(3, 3, 1, 2)).toEqual(expected);
  });
});
