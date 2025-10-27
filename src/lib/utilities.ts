export function invoke<R> (fn: () => R, thisArg?: unknown): R {
  return fn.call(thisArg)
}
