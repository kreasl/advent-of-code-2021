import { output, readFile } from '../../helpers/streams';
import { getStatesProducer, parseState } from './helpers';
import { calculateArraySum } from '../../helpers/arrays';

const MAX_DAYS = 256;

const input = readFile('puzzles/06/input.txt')
  .split().compact();

const states = input
  .map(parseState)
  .consume(getStatesProducer(MAX_DAYS))
  .map(calculateArraySum)

const answer = states
  .drop(MAX_DAYS - 1)
  .take(1);

output(answer);
