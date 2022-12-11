import { Display } from './interface';
import { array2Number } from '../../helpers/arrays';

const parseSeq = (str: string): string[] => {
  return str
    .split(' ')
    .map((s) => s.split('').sort().join(''));
}

export const parseDisplay = (str: string): Display => {
  const [test, output] = str.split(' | ');

  return { test: parseSeq(test), output: parseSeq(output) };
}

export const countUniqueDigits = (display: Display): number => {
  return display.output.filter((d) => [2, 4, 3, 7].includes(d.length)).length;
}

const exclude = <T>(a: T[], b: T[]): T[] => {
  return a.filter((x) => !b.includes(x));
}

export const deduceMap = (display: Display): Display => {
  const test = display.test.sort((a, b) => a.length - b.length);
  const arrays = test.map((str) => str.split(''));

  const arrayMap: Record<number, string[]> = {
    1: arrays[0],
    4: arrays[2],
    7: arrays[1],
    8: arrays[9],
  };
  arrayMap[2] = arrays.slice(3, 6).filter((arr) => exclude(arr, arrayMap[4]).length === 3).at(0);
  arrayMap[5] = arrays.slice(3, 6).filter((arr) => exclude(arr, arrayMap[2]).length === 2).at(0);
  arrayMap[3] = arrays.slice(3, 6).filter((arr) => exclude(arr, arrayMap[2]).length === 1).at(0);
  arrayMap[9] = arrays.slice(6, 9).filter((arr) => exclude(arr, arrayMap[3]).length === 1).at(0)
  arrayMap[0] = arrays.slice(6, 9).filter((arr) => exclude(arr, arrayMap[5]).length === 2).at(0)

  const map: Record<string, number> = {};
  for (let d in arrayMap) {
    map[arrayMap[d].join('')] = parseInt(d);
  }
  map[test.filter((s) => !Object.keys(map).includes(s)).at(0)] = 6;

  return { ...display, map };
}

export const encodeOutput = (display: Display): number => {
  const arr =  display.output.map((d) => display.map[d]);

  return array2Number(arr, 10);
}
