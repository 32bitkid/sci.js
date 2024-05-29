export function exhaustive(msg: string, _: never): never {
  throw new Error(`${msg}: ${JSON.stringify(_)}`);
}
