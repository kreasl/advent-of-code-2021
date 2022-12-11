import { output, readFile } from '../../helpers/streams';
import { errorsProducer } from './helpers';
import { closingPrices, pairs, prices } from './interface';
import { array2Number } from '../../helpers/arrays';

const input = readFile('puzzles/10/input.txt')
  .split().compact();

const chunks = input
  .map((line) => line.split(''));

const stacks = chunks
  .consume(errorsProducer);

// const answers = errors
  // .map((err) => prices[err])
  // .reduce1((a: number, b: number) => a + b);

const answers = stacks
  .map((stack) => stack.reverse())
  .map((seq) => seq.map((c) => closingPrices[c]))
  .map((arr) => array2Number(arr, 5))
  .sortBy((a: number, b: number) => a - b)
  .collect()
  .map((arr) => arr[Math.floor(arr.length / 2)])

output(answers);

