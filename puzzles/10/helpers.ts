import * as H from 'highland';
import { Producer } from '../../helpers/interface';
import { pairs } from './interface';

export const errorsProducer: Producer<string[], string[]> = (err, line, push, next) => {
  if (H.isNil(line)) {
    push(null, H.nil);
    return;
  }

  const openers = Object.keys(pairs);

  const stack = [];
  let pos = 0;
  let valid = null;

  do {
    if (openers.includes(line[pos])) {
      stack.push(line[pos]);
    } else {
      stack.pop();
    }

    valid = [...openers, pairs[stack.at(-1)]]
    pos++;
  } while (pos < line.length && valid.includes(line[pos]));

  /* Part 1 */
  // if (pos < line.length) push(null, line[pos]);

  if (pos === line.length) push(null, stack);

  next();
};
