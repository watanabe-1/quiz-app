/**
 * Converts a file size from bytes to megabytes with a specified number of decimals.
 *
 * @param sizeInBytes - The file size in bytes.
 * @param decimalsNum - The number of decimal places to round to (default is 2).
 * @returns The file size in megabytes, rounded to the specified number of decimals.
 */
export const sizeInMB = (sizeInBytes: number, decimalsNum = 2): number => {
  const result = sizeInBytes / (1024 * 1024);

  return +result.toFixed(decimalsNum);
};
