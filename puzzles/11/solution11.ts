import { output, readFile } from '../../helpers/streams';
import {  parseIntArray } from '../../helpers/arrays';
import { getStepsProducer } from './producers';
import { countZeros } from './helpers';

const STEPS = 400;

const input = readFile('puzzles/11/input.txt')
  .split().compact();

const map = input
  .map((line) => line.split(''))
  .map(parseIntArray)
  .collect();

const steps = map
  .consume(getStepsProducer(STEPS));

const answer = steps
  .map<number>(countZeros)
  .reduce([0], (a: number[], b: number) => {
    a[a.length - 1]++;

    if (b === 100) a.push(a[a.length - 1]);

    return a;
  });

output(answer);
