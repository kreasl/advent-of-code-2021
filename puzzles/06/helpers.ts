import * as H from 'highland';
import { Producer } from '../../helpers/interface';

export const parseState = (str: string): number[] => {
  const state = Array(9).fill(0);

  str
    .split(',')
    .map((x) => parseInt(x))
    .forEach((c) => state[c]++);

  return state;
}

export const getStatesProducer = (maxDays: number): Producer<number[], number[]> => {
  let state = [];
  let day = 0;

  return (err, st, push, next) => {
    if (H.isNil(state)) {
      push(null, H.nil);
      return;
    }

    state = [...(st as number[])];

    while (day <= maxDays) {
      const births = state[0];

      state = [...state.slice(1), births];
      state[6] += births;

      push(null, state);

      day++;
    }

    next();
  };
};
