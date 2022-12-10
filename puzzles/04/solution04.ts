import * as H from 'highland';
import { parseIntArray } from '../../helpers/arrays';
import { dropWhile, output, readFile, takeWhile } from '../../helpers/streams';
import Stream = Highland.Stream;

const input = readFile('input.txt').split().compact();

interface Pos {
  x: number;
  y: number;
}
interface Markings {
  cols: number[];
  rows: number[];
}

const TABLE_SIZE = 5;

const getPos = (table: number[][], num: number): Pos | null => {
  const idx = table.flat().indexOf(num);

  if (idx < 0) return null;

  const x = idx % TABLE_SIZE;
  const y = Math.floor(idx / TABLE_SIZE);

  return { x, y};
}
const getPositions = (tables: number[][][], num): Array<Pos | null> => {
  return tables.map((table) => getPos(table, num));
}

const getPromise = <T>(stream: Stream<T>) => {
  return stream.collect().toPromise(Promise);
}

const getSequencePromise = (stream: Stream<string>) => {
  const seqStream = stream.observe()
    .head()
    .map((str) => str.split(','))
    .map(parseIntArray)
    .flatten()

  return getPromise(seqStream);
}
const getTablesPromise = (stream: Stream<string>) => {
  const tablesStream = stream.observe()
    .drop(1)
    .map((str) => str.split(/\b\s+\b/g))
    .map(parseIntArray)
    .batch(TABLE_SIZE);

  return getPromise(tablesStream);
}

const getInitialMarkings = (count: number): Markings[] => {
  return Array(count).fill(0)
    .map((_): Markings => {
    return {
      cols: Array(TABLE_SIZE).fill(0),
      rows: Array(TABLE_SIZE).fill(0),
    };
  });
}

const getMarkingSequence = (sequence: number[], tables: number[][][]) => {
  const positionsSequence = sequence.map((draw) => {
    return getPositions(tables, draw);
  });

  return H(positionsSequence)
    .consume((() => {
      let markings = getInitialMarkings(tables.length);

      return (err, positions, push, next) => {
        if (!H.isNil(positions)) {
          markings = updateMarkings(markings, positions);
          push(null, markings);
          next();
        } else {
          push(null, positions);
        }
      };
    })());
};

const updateMarkings = (markings: Markings[], positions: Pos[]): Markings[] => {
  return markings.map((tMarkings: Markings, idx) => {
    const pos = positions[idx];

    if (pos === null) {
      return tMarkings;
    }

    const { x, y } = pos;

    const newMarkings = {
      cols: [...tMarkings.cols],
      rows: [...tMarkings.rows],
    };
    newMarkings.cols[x]++;
    newMarkings.rows[y]++;

    return newMarkings;
  });
}
const getWinners = (markings: Markings[]): number[] => {
  return markings
    .map((tMarkings, idx) => {
      if (Object.values(tMarkings).flat().some((marks) => marks === TABLE_SIZE)) {
        return idx;
      }

      return null;
    })
    .filter((res) => res !== null);
};

(async () => {
  const seqPromise = getSequencePromise(input);
  const tablesPromise = getTablesPromise(input);
  input.each(() => {});

  const sequence = await seqPromise;
  const tables = await tablesPromise;

  const winTableSeq = takeWhile(
    getMarkingSequence(sequence, tables),
    (markings) => getWinners(markings).length !== tables.length,
  )
    .last()
    .map(getWinners)
    .map((winners) => Object.keys(tables).filter((_, idx) => !winners.includes(idx)))
    .flatten()
    .map((x) => parseInt(x))
    .flatten();
  const drawsToWinSeq = takeWhile(
    getMarkingSequence(sequence, tables),
    (markings) => getWinners(markings).length !== tables.length,
  )
    .reduce(1, (a) => a + 1)

  const answer = winTableSeq.zip(drawsToWinSeq)
    .map(([winTable, drawsToWin]) => {
      const winSeq = sequence.slice(0, drawsToWin);

      const unmarkedSum = tables[winTable]
        .flat()
        .filter((x) => !winSeq.includes(x))
        .reduce((s, x) => s + x, 0);

      return winSeq.at(-1) * unmarkedSum;
    })

  output(answer);
})();
