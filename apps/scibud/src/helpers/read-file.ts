import { readdir, readFile as fsReadFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

export function escapeRegex(str: string) {
  return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

export async function readFile(
  folder: string,
  filename: string,
): Promise<Buffer> {
  try {
    const files = await readdir(folder);
    const regex = new RegExp(`^${escapeRegex(filename)}$`, 'i');
    const foundFile = files.find((fn) => regex.test(fn));
    if (foundFile === undefined) throw new Error('not found');
    return fsReadFile(join(folder, foundFile));
  } catch (_) {
    throw new Error(`${join(resolve(folder), filename)} not found!`);
  }
}
