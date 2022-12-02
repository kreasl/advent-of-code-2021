import * as H from 'highland';
import * as fs from 'fs';

export const parseIntArray = (arr: string[]) => arr.map((s) => parseInt(s));

export const calculateArraySum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const readFile = H.wrapCallback(fs.readFile);
