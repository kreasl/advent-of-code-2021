import { output, readFile } from '../../helpers/streams';
import { meanPriceProducer, modPriceProducer } from './helpers';

const input = readFile('puzzles/07/input.txt')
  .split().compact();

const positions = input
  .splitBy(',')
  .map((x) => parseInt(x))
  .sortBy((a, b) => a - b)
  .collect()
  .consume(meanPriceProducer)

output(positions);
