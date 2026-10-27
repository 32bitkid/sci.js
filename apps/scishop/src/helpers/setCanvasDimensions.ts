export function setCanvasDimensions(
  target: { height: number; width: number },
  width: number,
  height: number,
) {
  const isChanged = target.width !== width || target.height !== height;
  if (isChanged) {
    target.width = width;
    target.height = height;
  }
}
