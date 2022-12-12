import { Dot, Table } from '../../helpers/interface';

export const getCharged = (map: Table<number>): Dot[] => {
  return map.map((line, y) => {
    return line.map((energy, x) => {
      if (energy > 9) return { x, y };
    });
  })
    .flat()
    .filter((d) => d);
}

export const countZeros = (t: Table<number>): number => {
  return t
    .map((line) => line.filter((x) => x === 0))
    .flat().length
}
