export type BitReaderMode = 'msb' | 'lsb';

export interface BitReaderOptions {
  mode?: BitReaderMode;
  fast?: boolean;
}
