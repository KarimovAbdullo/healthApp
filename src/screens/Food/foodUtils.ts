export function formatUnit(unit: string) {
  const match = unit.trim().match(/^(\d+(?:\.\d+)?)([a-zA-Z]+)$/);
  if (!match) return unit;
  return `${match[1]} ${match[2]}`;
}

