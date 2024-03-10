export interface BitReader {
  isByteAligned(): boolean;
  align(): BitReader;
  seek(offset: number): BitReader;
  read32(n: number): number;
  peek32(n: number): number;
  skip(n: number): BitReader;
}
