import { Peak } from './interface';
import { getNeighbors } from '../../helpers/arrays';

export const getDrains = (map: number[][], peak: Peak): Peak[] => {
  return getNeighbors(map, peak)
    .map(({ x, y }) => ({ x, y, height: map[y][x] }))
    .filter((nb) => nb.height < peak.height);
}
