import * as H from 'highland';
import { Dot, PowerDot, Producer, Segment } from '../../helpers/interface';
import { compareDots, getSegmentsIntersection } from '../../helpers/geometry';

export const parseSegment = (str: string): Segment => {
  const [xa, ya, xb, yb] = str.split(' -> ')
    .map((dStr) => dStr.split(','))
    .flat()
    .map((c) => parseInt(c));

  return { a: { x: xa, y: ya }, b: { x: xb, y: yb } };
}

export const isDiagonal = ({ a, b }: Segment): boolean => {
  return a.x !== b.x && a.y !== b.y;
}

export const getIntersectionsProducer = () => {
  return (err, segments, push, next) => {
    if (H.isNil(segments)) {
      push(null, H.nil);
      return;
    }

    segments.slice(0, -1)
      .forEach((seg1, ids) => {
        segments.slice(ids + 1)
          .forEach((seg2) => {
            push(null, getSegmentsIntersection(seg1, seg2));
          })
      });

    next();
  }
};

export const dotsProducer: Producer<Segment, Dot[]> = (err, segment, push, next) => {
  if (H.isNil(segment)) {
    push(null, H.nil);
    return;
  }

  const { a, b } = segment;

  const length = Math.abs(b.x - a.x || b.y - a.y) + 1;
  const idx = b.x === a.x ? 0 : (b.x - a.x) / Math.abs(b.x - a.x);
  const idy = b.y === a.y ? 0 : (b.y - a.y) / Math.abs(b.y - a.y);

  const dots = Array(length).fill(0)
    .map((_, id) => ({ x: a.x + id * idx, y: a.y + id * idy }));

  push(null, dots);

  next();
};

export const getPowerDotsProducer = (): Producer<Dot, PowerDot> => {
  let prevDot = null;
  let count = 1;

  return (err, dot, push, next) => {
    if (H.isNil(dot)) {
      push(null, H.nil);
      return;
    }

    if (prevDot !== null) {
      if (!compareDots(dot, prevDot)) {
        count++;
      } else {
        push(null, { x: prevDot.x, y: prevDot.y, power: count });
        count = 1;
      }
    }

    prevDot = dot;
    next();
  }
}
