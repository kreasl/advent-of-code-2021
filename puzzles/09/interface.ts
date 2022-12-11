import { Dot } from '../../helpers/interface';

export interface Peak extends Dot {
  height: number;
}

export interface PeakWithNeighbors extends Peak {
  neighbors: Peak[];
}
