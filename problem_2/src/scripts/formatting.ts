const DECIMALS = 4;

/**
 * Formats number into string with limited decimals
 * @param value Number to format
 */
export function formatNumber(value: number): string {
  return Number(value.toFixed(DECIMALS)).toString()
}