export function createDebounce(
  fn: (...args: unknown[]) => unknown,
  delay: number
) {
  let timer: NodeJS.Timeout | number = 0;
  return function debounce(...args: unknown[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
