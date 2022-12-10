import { output, readFile } from '../../helpers/streams';
import { dotsProducer, getPowerDotsProducer, parseSegment } from './helpers';
import { compareDots } from '../../helpers/geometry';

const input = readFile('input.txt')
  .split().compact();

const segments = input
  .map(parseSegment);

const powerDots = segments
  .consume(dotsProducer)
  .flatten()
  .sortBy(compareDots)
  .consume(getPowerDotsProducer())
  .filter(({ power }) => power > 1)
  .reduce(0, (a) => a + 1);

output(powerDots);
// draw(powerDots, 10, 10);
