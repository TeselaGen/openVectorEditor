export function coerceInitialValue({ initialValue, minCharWidth }) {
  const scaleFactor = Math.pow(12 / minCharWidth, 1 / 10);

  const zoomLvl = Math.log(initialValue / minCharWidth) / Math.log(scaleFactor);

  return zoomLvl;
}
