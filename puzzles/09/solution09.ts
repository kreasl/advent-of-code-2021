import * as H from 'highland';
import { batchWithHead, output, readFile } from '../../helpers/streams';
import { getBasinsProducer, pointsWithNeighborsProducer } from './producers';

const input = readFile('puzzles/09/input.txt')
  .split().compact();

(async () => {
  const map: number[][] = await input
    .map((str) => str.split('').map((x) => parseInt(x)))
    .collect()
    .toPromise(Promise);

  const lowPoints = H([map])
    .consume(pointsWithNeighborsProducer)
    .filter(({ height, neighbors }) => neighbors.every(({ height: h }) => h > height));

  const basins = lowPoints
    .consume(getBasinsProducer(map))
    .map((basin) => basin)
    .flatten();

  /* Part 1 */
  // const answer = lowPoints
  //   .map(({ height }) => height + 1)
  //   .reduce1((a: number, b: number) => a + b);

  const answer = batchWithHead(
    basins,
    (dot) => dot.hasOwnProperty('neighbors'),
  )
    .map((basin) => basin.length)
    .sortBy((a: number, b: number) => (b - a))
    .take(3)
    .reduce1((a: number, b: number) => a * b)

  output(answer);
})();

// 284 low
