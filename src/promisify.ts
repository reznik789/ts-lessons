type Callback<T> = (err: Error | null, result: T) => void;

function promisify<ResultType, Args extends any[]>(
  fn: (...args: [...Args, Callback<ResultType>]) => void
): (...args: Args) => Promise<ResultType> {
  return function (...args: Args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err: Error | null, res: ResultType) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  };
}

declare function addAsync(
  x: number,
  y: number,
  cb: (err: Error | null, result: number) => void
): void;

const addProm = promisify(addAsync);
// x is number!
addProm(1, 2).then((x) => x);
