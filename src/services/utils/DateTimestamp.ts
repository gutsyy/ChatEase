// 精度为秒
export const dateToTimestamp = (date: Date) =>
  Math.floor(date.getTime() / 1000);

export const timestampToDate = (timestamp: number) =>
  new Date(timestamp * 1000);
