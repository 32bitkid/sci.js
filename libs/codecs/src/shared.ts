type MutableProperties = 'copyWithin' | 'fill' | 'reverse' | 'set' | 'sort';

export interface ReadonlyUint8Array
  extends Omit<Uint8Array, MutableProperties> {
  readonly [n: number]: number;
}

export type Sequence = ReadonlyUint8Array;
export type CodeMapping = [number, Sequence];
