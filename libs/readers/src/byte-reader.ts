import { FileHandle } from 'fs/promises';

export interface ByteReaderOptions {
  position?: number;
  buffer?: Uint8Array;
  offset?: number;
}

export interface ByteReader {
  read(
    length: number,
    options?: ByteReaderOptions,
  ): Uint8Array | Promise<Uint8Array>;

  close(): Promise<void> | void;
}

export class AsyncFileByteReader implements ByteReader {
  private readonly file: FileHandle;
  private offset: number;

  constructor(file: FileHandle) {
    this.file = file;
    this.offset = 0;
  }

  async read(
    length: number,
    options: ByteReaderOptions = {},
  ): Promise<Uint8Array> {
    const {
      buffer = new Uint8Array(length),
      position = this.offset,
      offset = 0,
    } = options;
    await this.file.read({ length, position, buffer, offset });
    this.offset += length;
    return buffer;
  }

  async close() {
    await this.file.close();
  }
}

export class SyncByteReader implements ByteReader {
  private readonly bytes: Uint8Array;
  private offset: number;

  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
    this.offset = 0;
  }

  read(length: number, options: ByteReaderOptions = {}): Uint8Array {
    const {
      buffer = new Uint8Array(length),
      position = this.offset,
      offset = 0,
    } = options;
    buffer.set(this.bytes.subarray(position, position + length), offset);
    this.offset += length;
    return buffer;
  }

  close() {}
}
