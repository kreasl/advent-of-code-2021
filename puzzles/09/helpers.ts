import { Dot } from '../../helpers/interface';
import { Peak } from './interface';

export const getNeighbors = (map: number[][], { x, y }: Dot): Peak[] => {
  return [
    { x: x - 1, y, height: map[y][x - 1] },
    { x: x + 1, y, height: map[y][x + 1] },
    { x, y: y -1, height: (map[y - 1] || [])[x] },
    { x, y: y + 1, height: (map[y + 1] || [])[x] },
  ]
    .filter(({ height }) => height !== undefined);
}

export const getDrains = (map: number[][], peak: Peak): Peak[] => {
  return getNeighbors(map, peak)
    .filter((nb) => nb.height < peak.height);
}
