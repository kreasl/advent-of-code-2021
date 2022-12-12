import * as H from 'highland';
import Stream = Highland.Stream;
import { Dot, Producer } from '../../helpers/interface';
import { Peak, PeakWithNeighbors } from './interface';
import { getNeighbors } from '../../helpers/arrays';

export const pointsWithNeighborsProducer: Producer<number[][], PeakWithNeighbors> = (err, map, push, next) => {
  if (H.isNil(map)) {
    push(null, H.nil);
    return;
  }

  map.forEach((line, y) => {
    line.forEach((height, x) => {
      const neighbors: Peak[] = getNeighbors(map, { x, y })
        .map(({ x, y }) => ({ x, y, height: map[y][x] }));

      push(null, { x, y, height, neighbors });
    });
  });

  next();
}

export const getBasinProducer = (map: number[][]): Producer<any, any> => {
  const basin = [];
  let pos = null;

  return (err, dot, push, next) => {
    if (H.isNil(dot)) {
      push(null, H.nil);
      return;
    }

    basin.push(dot);
    pos = 0;

    while (pos < basin.length) {
      const neighbors = getNeighbors(map, basin[pos])
        .map(({ x, y }) => ({ x, y, height: map[y][x] }))
        .filter((dot) => dot.height < 9)
        .filter(({ x, y }) => basin.every((dot) => !(dot.x === x && dot.y === y)));

      neighbors.forEach((dot) => basin.push(dot));

      push(null, basin[pos]);

      pos++;
    }

    next();
  };
};

export const getBasinsProducer = (map: number[][]): Producer<Dot, Stream<Dot>> => {
  return (err, lowPoint: Peak, push, next) => {
    if (H.isNil(lowPoint)) {
      push(null, H.nil);
      return;
    }

    const basin = H([lowPoint])
      .consume(getBasinProducer(map));

    push(null, basin);
    next();
  };
}
