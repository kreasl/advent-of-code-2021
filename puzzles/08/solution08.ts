import { output, readFile } from '../../helpers/streams';
import { countUniqueDigits, deduceMap, encodeOutput, parseDisplay } from './helpers';

const input = readFile('puzzles/08/input.txt')
  .split().compact();

const displays = input
  .map(parseDisplay)
  .map(deduceMap);

/* Part 1 */
// const answer = displays
//   .map(countUniqueDigits)
//   .reduce1((a: number, b: number) => a + b);

const answer = displays
  .map(encodeOutput)
  .reduce1((a: number, b: number) => a + b);

output(answer);
