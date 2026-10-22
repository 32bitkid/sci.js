import type { ReadStream as ttyReadStream } from 'node:tty';
import { createReadStream, type ReadStream as fsReadStream } from 'node:fs';
import { readdir, readFile as fsReadFile } from 'node:fs/promises';
import { join, resolve, dirname, basename } from 'node:path';

export function escapeRegex(str: string) {
  return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

export async function readFile(root: string, fn: string): Promise<Buffer> {
  try {
    const fpath = resolve(root, fn);
    const folder = dirname(fpath);
    const filename = basename(fpath);

    const files = await readdir(folder);
    const regex = new RegExp(`^${escapeRegex(filename)}$`, 'i');
    const foundFile = files.find((fn) => regex.test(fn));
    if (foundFile === undefined) throw new Error('not found');
    return fsReadFile(join(folder, foundFile));
  } catch (_) {
    throw new Error(`${resolve(root, fn)} not found!`);
  }
}

export async function readFileStream(
  root: string,
  fn: string,
): Promise<ttyReadStream | fsReadStream> {
  if (fn === '-') return process.stdin;

  try {
    const fpath = resolve(root, fn);
    const folder = dirname(fpath);
    const filename = basename(fpath);

    const files = await readdir(folder);
    const regex = new RegExp(`^${escapeRegex(filename)}$`, 'i');
    const foundFile = files.find((fn) => regex.test(fn));
    if (foundFile === undefined) throw new Error('not found');

    return createReadStream(join(folder, foundFile));
  } catch (_) {
    throw new Error(`${resolve(root, fn)} not found!`);
  }
}
