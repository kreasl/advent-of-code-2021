import { parseIntArray, sumsOfArrays, array2Number } from '../../helpers/arrays';
import { output, readFile } from '../../helpers/streams';

const answer = readFile('input.txt')
  .split().compact()
  .map((s) => s.split(''))
  .map(parseIntArray)
  .reduce(
    { count: 0, ones: null },
    ({ count, ones }, arr) => {
      if (!ones) return { count: 1, ones: arr };

      return { count: count + 1, ones: sumsOfArrays(ones, arr) }
    },
  )
  .map(({ count, ones }) => ones.map((onesCount) => onesCount > count / 2 ? 1 : 0))
  .map((arr) => {
    return [arr, arr.map((x) => Math.abs(x - 1))]
  })
  .map((vals) => vals.map((valArr) => array2Number(valArr, 2)))
  .flatten()
  .reduce1((a, b) => a * b);

output(answer);
