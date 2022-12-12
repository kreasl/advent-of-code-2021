export type Producer<T, U> = (
  err: Error,
  x: T | Highland.Nil,
  push: (err: Error | null, value?: U | Highland.Nil) => void,
  next: () => void,
) => void;

export interface Dot {
  x: number;
  y: number;
}

export interface PowerDot extends Dot {
  power: number;
}

export type Vec = Dot;
export interface Segment {
  a: Dot,
  b: Dot,
}

export interface Line {
  x1: number;
  x0: number;
  y1: number;
  y0: number;
}

export interface Smb {
  pos: number;
  char: string;
}

export type Table<T> = T[][];
