import { Dot, Line, Segment, Vec } from './interface';
import { getIntersection } from './arrays';

export const composeVectors = ({ x: ax, y: ay }: Dot | Vec, { x: bx, y: by }: Vec): Dot | Vec => {
  return {
    x: ax + bx,
    y: ay + by,
  };
};

export const reverseVector = ({ x, y }: Vec): Vec => {
  return { x: -x, y: -y };
}

export const getSegmentCount = ({ a, b }: Segment) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + 1;
};

export const compareSegments = ({ a: a1, b: b1 }: Segment, { a: a2, b: b2 }: Segment): number => {
  return a1.x - a2.x || a1.y - a2.y || b1.x - b2.x || b1.y - b2.y;
};

export const compareDots = ({ x: x1, y: y1 }: Dot, { x: x2, y: y2 }: Dot): number => {
  return x1 - x2 || y1 - y2;
};

export const getLineFromSegment = ({ a, b }: Segment): Line => {
  const dx = Math.abs(b.x - a.x);
  const dy = Math.abs(b.y - a.y);

  if (dx === 0) return { x1: 0, x0: a.x, y1: 1, y0: 0 };
  if (dy === 0) return { x1: 1, x0: 0, y1: 0, y0: a.y };
};

export const getDot = (line: Line, t: number): Dot => {
  return { x: line.x1 * t + line.x0, y: line.y1 * t + line.y0 };
};

const getLinesIntersection = (line1: Line, line2: Line): Dot | Line | null => {
  if (line1.x1 === 0) {
    if (line2.x1 === 0) {
      if (line1.x0 === line2.x0) return line1;
      return null;
    }
    if (line2.y1 === 0) return { x: line1.x0, y: line2.y0 };
  }

  if (line2.x1 === 0) {
    if (line1.y1 === 0) return { x: line2.x0, y: line1.y0 };
  }

  if (line1.y1 === 0) {
    if (line2.y1 === 0) {
      if (line1.y0 === line2.y0) return line1;
      return null;
    }

    if (line2.x1 === 0) return { x: line2.x0, y: line1.y0 };
  }

  return null;
};

export const getSegmentsIntersection = (seg1: Segment, seg2: Segment): Dot[] => {
  const line1 = getLineFromSegment(seg1);
  const line2 = getLineFromSegment(seg2);

  const intersection = getLinesIntersection(line1, line2);

  if (intersection === null) {
    return [];
  }
  if (intersection.hasOwnProperty('x')) {
    const dot = intersection as Dot;
    const [x11, x12] = [seg1.a.x, seg1.b.x].sort((a, b) => a - b);
    const [y11, y12] = [seg1.a.y, seg1.b.y].sort((a, b) => a - b);
    const [x21, x22] = [seg2.a.x, seg2.b.x].sort((a, b) => a - b);
    const [y21, y22] = [seg2.a.y, seg2.b.y].sort((a, b) => a - b);

    if (
      x11 <= dot.x && dot.x <= x12
      && x21 <= dot.x && dot.x <= x22
      && y11 <= dot.y && dot.y <= y12
      && y21 <= dot.y && dot.y <= y22
    ) {
      return [dot];
    }

    return [];
  }

  const line = intersection as Line;

  const k1 = line.x1 || line.y1;
  const k0 = line.x1 ? line.x0 : line.y0;

  const [t11, t12] = [(seg1.a.x - k0) / k1, (seg1.b.x - k0) / k1]
    .sort((a, b) => a - b);
  const [t21, t22] = [(seg2.a.x - k0) / k1, (seg2.b.x - k0) / k1]
    .sort((a, b) => a - b);

  const t1 = Math.max(t11, t21);
  const t2 = Math.min(t12, t22);

  const dots = [];
  for (let t = t1; t <= t2; t++) {
    dots.push({ x: line.x1 * t + line.x0, y: line.y1 * t + line.y0 });
  }

  return dots;
};
