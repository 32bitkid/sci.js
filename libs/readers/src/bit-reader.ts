export interface BitReader {
  align(): BitReader;
  isByteAligned(): boolean;
  peek32(n: number): number;
  read32(n: number): number;
  seek(offset: number): BitReader;
  skip(n: number): BitReader;
}
