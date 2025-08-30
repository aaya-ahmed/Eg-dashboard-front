export function generatePaginationRange(current: number, total: number) {
  const delta = 1;
  const range: (number | "...")[] = [];

  for (let i = 0; i < total; i++) {
    if (
      i === 0 || // First
      i === total - 1 || // Last
      i === current || // Current
      i === current - delta || // Previous
      i === current + delta // Next
    ) {
      range.push(i);
    } else if (
      range[range.length - 1] !== "..." &&
      i !== total - 1
    ) {
      range.push("...");
    }
  }

  return range;
}
export function getParamValue(key: string) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}
export function setParamValue(key: string, value: any) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set(key, value);
  window.history.pushState({}, "", newUrl);
}