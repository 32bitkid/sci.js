type TypeArrayConstructor =
  | Uint8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Uint16ArrayConstructor
  | Uint32ArrayConstructor
  | Int8ArrayConstructor
  | Int16ArrayConstructor
  | Int32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor;

type BufferType =
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Float32Array
  | Float64Array;

const MAX_SAFE_DWORD = ~0 >>> 0;

export class NumericDeque {
  private head = 0;
  private tail = 0;
  private size = 0;
  private readonly mask: number;
  private readonly capacity: number;
  private readonly buffer: BufferType;

  constructor(minSize: number, Buffer: TypeArrayConstructor = Float64Array) {
    if (minSize <= 1) throw new Error(`Out of bounds: ${minSize} <= 1`);
    if (minSize > MAX_SAFE_DWORD)
      throw new Error(`Out of bounds: ${minSize} > ${MAX_SAFE_DWORD}`);

    this.capacity = 2 ** (32 - Math.clz32(minSize - 1));
    this.mask = ~0 >>> Math.clz32(minSize - 1);
    this.buffer = new Buffer(this.capacity);
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  push(value: number) {
    if (this.size + 1 > this.capacity)
      throw new Error('overflow: queue is full');

    this.buffer[this.tail] = value;
    this.tail = (this.tail + 1) & this.mask;
    this.size++;
  }

  pop(): number {
    if (this.size === 0) throw new Error('underflow: queue is empty');
    this.tail = (this.tail - 1) & this.mask;
    this.size--;
    return this.buffer[this.tail];
  }

  unshift(value: number) {
    if (this.size + 1 > this.capacity)
      throw new Error('overflow: queue is full');

    this.head = (this.head - 1) & this.mask;
    this.size++;
    this.buffer[this.head] = value;
  }

  shift(): number {
    if (this.size === 0) throw new Error('underflow: queue is empty');
    const value = this.buffer[this.head];
    this.head = (this.head + 1) & this.mask;
    this.size--;
    return value;
  }

  peekHead(): number {
    return this.buffer[this.head];
  }

  peekTail(): number {
    return this.buffer[(this.tail - 1) & this.mask];
  }
}
