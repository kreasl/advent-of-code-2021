import * as H from 'highland';
import { output, readFile } from '../../helpers/streams';

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

const answer = first
  .zip(second)
  .filter((arr) => arr.every((x) => !isNaN(x)))
  .map(([s1, s2]) => s2 - s1)
  .filter((diff) => diff > 0)
  .collect()
  .map((arr) => arr.length);

output(answer);

input.each(() => {});
sums.each(() => {});
