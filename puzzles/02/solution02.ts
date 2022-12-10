import { output, readFile } from '../../helpers/streams';

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

const answer = readFile('input.txt')
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

output(answer);
