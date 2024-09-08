import { useEffect, useMemo, useState } from "react";
import { CurrencyData } from "../types";
import { getCurrencyData } from "../api";

export function useCurrencies() {
  const [currenciesData, setCurrenciesData] = useState<CurrencyData[]>([]);

  useEffect(() => {
    getCurrencyData().then(data => {
      const dataWithoutDuplicates: CurrencyData[] = data.reduce((acc, current) => {
        const currency = acc.find(item => item.currency === current.currency);
        if (!currency) {
          acc.push(current);
        }
        return acc;
      }, [] as CurrencyData[]);

      setCurrenciesData(dataWithoutDuplicates);
    });
  }, []);

  // preparing object with key as currency name and price as value for easy price access
  const currencyPrices = useMemo(() => {
    const prices: { [currency: string]: number } = {};

    for (let currencyData of currenciesData) {
      prices[currencyData.currency] = currencyData.price;
    }

    return prices;
  }, [currenciesData]);

  /**
   * Calculates amount Out for given amount In and specific currencies
   * @param currencyIn Currency that will be spent
   * @param currencyOut Currency that will be bought
   * @param amountIn Amount that will be spent
   * @return Amount that will be received
   */
  function getAmountOut(
    currencyIn: string,
    currencyOut: string,
    amountIn: number
  ) {
    return amountIn * currencyPrices[currencyIn] / currencyPrices[currencyOut];
  }

  /**
   * Calculates amount In for given amount Out and specific currencies
   * @param currencyIn Currency that will be spent
   * @param currencyOut Currency that will be bought
   * @param amountOut Amount that will be received
   * @return Amount that should be spent
   */
  function getAmountIn(
    currencyIn: string,
    currencyOut: string,
    amountOut: number
  ) {
    return amountOut * currencyPrices[currencyOut] / currencyPrices[currencyIn];
  }

  return {
    currenciesData,
    getAmountIn,
    getAmountOut,
  };
}