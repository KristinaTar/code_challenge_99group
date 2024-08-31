import { CurrencyData } from "../types";

/**
 * @return List of currencies with prices
 */
export async function getCurrencyData() {
  const rawData = await fetch('https://interview.switcheo.com/prices.json');
  return (await rawData.json()) as CurrencyData[];
}