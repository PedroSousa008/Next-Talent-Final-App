/** Display height in metres with comma decimal (e.g. 1,80 m). */
export function formatHeightMeters(m: number): string {
  return `${m.toFixed(2).replace(".", ",")} m`;
}

export function metersToFeetInches(m: number): string {
  const totalIn = m * 39.3700787;
  const ft = Math.floor(totalIn / 12);
  let inch = Math.round(totalIn - ft * 12);
  if (inch >= 12) {
    return `${ft + 1}'0"`;
  }
  if (inch < 0) {
    inch = 0;
  }
  return `${ft}'${inch}"`;
}

export function formatWeightKg(kg: number): string {
  return `${Math.round(kg)} kg`;
}

export function formatWeightLb(kg: number): string {
  const lb = kg * 2.2046226218;
  return `${Math.round(lb)} lbs`;
}
