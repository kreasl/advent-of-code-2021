import * as H from 'highland';
import { readFile } from '../helpers';

const output = process.stdout;

const parseCommand = (cmd) => {
  const [dir, val] = cmd.split(' ');

  const intVal = parseInt(val, 10);

  switch (dir) {
    case 'forward':
      return [intVal, 0];
    case 'down':
      return [0, intVal];
    case 'up':
      return [0, -intVal];
    default:
      throw new Error(`Unknown operation: ${dir}`);
  }
}

const input = readFile('input.txt')
  .split()
  .compact()
  .map(parseCommand)
  .reduce(
    [0, 0, 0],
    (
      [x, y, aim],
      [dMove, dAim],
    ) => [
      x + dMove,
      y + aim * dMove,
      aim + dAim
    ],
  )
  .map(([x, y]) => x * y)

// input.each(() => {});
input.map(JSON.stringify).intersperse('\n').pipe(output);
