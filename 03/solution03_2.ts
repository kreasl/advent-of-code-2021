import * as H from 'highland';
import Stream = Highland.Stream;
import { readFile, parseIntArray, array2Number } from '../helpers';

const filterArrays = async (
  cond: Function,
  pos: number,
  incoming: Stream<Array<number>>,
): Promise<Stream<Array<number>>> => {
  const input = await incoming;

  const cache = input.observe();
  const digit = await input
    .reduce(
      { count: 0, ones: 0 },
      ({ count,  ones }, arr) => ({ count: count + 1, ones: ones + arr[pos] }),
    )
    .map(({ count, ones }) => cond(count, ones))
    .toPromise(Promise);

  return cache.filter((arr) => arr[pos] === digit);
};

(async () => {
  const output = process.stdout;

  const input = readFile('input.txt')
    .split().compact()
    .map((s) => s.split(''))
    .map(parseIntArray);

  const input1 = input.observe();
  const input0 = input.observe();
  input.each(() => {});

  const cond1 = (c, o) => {
    if (c === o) return 1;
    if (o === 0) return 0;

    return (o >= c / 2) ? 1 : 0;
  }
  const cond0 = (c, o) => {
    if (c === o) return 1;
    if (o === 0) return 0;

    return (o >= c / 2) ? 0 : 1;
  }

  const filters1 = new Array(12).fill(0)
    .map((_, i) => i)
    .map((pos) => H.partial(filterArrays, cond1, pos));
  const filters0 = new Array(12).fill(0)
    .map((_, i) => i)
    .map((pos) => H.partial(filterArrays, cond0, pos));

  const filterSequence1 = H.seq.apply(H, filters1);
  const filterSequence0 = H.seq.apply(H, filters0);

  const result1 = await filterSequence1(input1);
  const result0 = await filterSequence0(input0);

  H([
    result1.map(array2Number),
    result0.map(array2Number),
  ])
    .flatten()
    .reduce1((a, b) => a * b)
    .map(JSON.stringify)
    .intersperse('\n')
    .pipe(output);
})();
