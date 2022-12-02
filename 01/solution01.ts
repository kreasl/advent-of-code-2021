import * as H from 'highland';
import { readFile } from '../helpers';

const output = process.stdout;

const input = readFile('input.txt')
  .split()
  .map((s) => parseInt(s));
const v1 = input.observe();
const v2 = input.observe().drop(1)
const v3 = input.observe().drop(2);

const sums = H([v1, v2, v3])
  .zipAll0()
  .filter((arr) => arr.every((x) => !isNaN(x)))
  .map((arr) => arr.reduce((acc, x) => acc + x, 0));

const first = sums.observe();
const second = sums.observe().drop(1);

first
  .zip(second)
  .filter((arr) => arr.every((x) => !isNaN(x)))
  .map(([s1, s2]) => s2 - s1)
  .filter((diff) => diff > 0)
  .collect()
  .map((arr) => arr.length)
  .map(JSON.stringify)
  .intersperse('\n')
  .pipe(output);

input.each(() => {});
sums.each(() => {});
