import * as H from 'highland';
import { calculateArraySum } from '../../helpers/arrays';

export const modPriceProducer = (err, arr, push, next) => {
  if (H.isNil(arr)) {
    push(null, H.nil);
    return;
  }

  const a = arr[Math.floor(arr.length / 2)];
  const b = arr[Math.ceil(arr.length / 2)];

  const mod = (a === b) ? a : Math.floor((a + b) / 2);

  const sum = calculateArraySum(
    arr.map((x) => Math.abs(x - mod)),
  );

  push(null, sum);

  next();
}

const calculateProgressiveSum = (arr, mean) => {
  const sum = arr
    .map((x) => Math.abs(x - mean))
    .map((d) => (1 + d) * d / 2);

  return calculateArraySum(sum);
};

export const meanPriceProducer = (err, arr, push, next) => {
  if (H.isNil(arr)) {
    push(null, H.nil);
    return;
  }

  const m1 = Math.floor(calculateArraySum(arr) / arr.length);
  const m2 = Math.ceil(calculateArraySum(arr) / arr.length);

  const s1 = calculateProgressiveSum(arr, m1);
  const s2 = calculateProgressiveSum(arr, m2);

  push(null, Math.min(s1, s2));

  next();
};
