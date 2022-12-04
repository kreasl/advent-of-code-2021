import * as H from 'highland';
import * as fs from 'fs';

export const print = (x: any) => console.log(`\n${JSON.stringify(x)}`);

export const parseIntArray = (arr: string[]) => arr.map((s) => parseInt(s));

export const calculateArraySum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const sumsOfArrays = (a1, a2) => a1.map((x, idx) => x + a2[idx]);

export const array2Number = (arr, base = 2) => {
  const num = arr.reduce(
    (sum, x) => {
      const s = sum * base + x;

      return s;
    },
    0
  );

  return num;
}

export const readFile = H.wrapCallback(fs.readFile);
