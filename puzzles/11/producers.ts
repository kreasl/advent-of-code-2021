import * as H from 'highland';
import { Producer, Table } from '../../helpers/interface';
import { getCharged } from './helpers';
import { getNeighbors } from '../../helpers/arrays';

export const getStepsProducer = (maxSteps: number): Producer<Table<number>, Table<number>> => {
  let state: Table<number> | null = null;
  let step = null;

  return (err, map,push, next) => {
    if (H.isNil(map)) {
      push(null, H.nil);
      return;
    }

    state = map;
    step = 0;

    while (step < maxSteps) {
      state.forEach((line, y) => {
        line.forEach((energy, x) => state[y][x] = energy + 1);
      });

      const charged = getCharged(state);
      let pos = 0;

      while (pos < charged.length) {
        const neighbors = getNeighbors(state, charged[pos], true)
          .filter((nb) => charged.every((ch) => nb.x !== ch.x || nb.y !== ch.y));

        neighbors.forEach(({ x, y }) => state[y][x]++);

        neighbors
          .filter(({ x, y }) => state[y][x] > 9)
          .forEach((nb) => charged.push(nb));

        pos++;
      }

      charged.forEach(({ x, y }) => state[y][x] = 0);

      push(null, state);

      step++;
    }

    next();
  };
}
