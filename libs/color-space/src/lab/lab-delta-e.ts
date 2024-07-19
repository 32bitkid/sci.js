import { LabTuple } from '../tuples/lab-tuple';

export function deltaE(labA: LabTuple, labB: LabTuple) {
  const deltaL = labA[1] - labB[1];
  const deltaA = labA[2] - labB[2];
  const deltaB = labA[3] - labB[3];
  const c1 = Math.sqrt(labA[2] * labA[2] + labA[3] * labA[3]);
  const c2 = Math.sqrt(labB[2] * labB[2] + labB[3] * labB[3]);
  const deltaC = c1 - c2;

  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);

  const sc = 1.0 + 0.045 * c1;
  const sh = 1.0 + 0.015 * c1;
  const deltaLKlsl = deltaL / 1.0;
  const deltaCkcsc = deltaC / sc;
  const deltaHkhsh = deltaH / sh;
  const i =
    deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;

  return i < 0 ? 0 : Math.sqrt(i);
}
