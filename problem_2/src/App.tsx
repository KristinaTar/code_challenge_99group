import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from "react-select";

import './App.scss';
import darkBg from "./images/darkBg.png";
import { useCurrencies } from "./hooks/useCurrencies";
import { SelectItem } from "./types";
import { formatNumber } from "./scripts/formatting";

function App() {
  const {
    currenciesData,
    getAmountIn,
    getAmountOut,
  } = useCurrencies();

  const [currencyIn, setCurrencyIn] = useState<
    SingleValue<SelectItem> | undefined
  >();
  const [currencyOut, setCurrencyOut] = useState<
    SingleValue<SelectItem> | undefined
  >();

  const [amountIn, setAmountIn] = useState<string | undefined>();
  const [amountOut, setAmountOut] = useState<string | undefined>();


  // if currency changes - recalculate amount OUT if possible
  useEffect(() => {
    const _amountIn = Number(amountIn);
    if (!currencyIn || !currencyOut || isNaN(_amountIn)) {
      return;
    }

    setAmountOut(formatNumber(getAmountOut(
      currencyIn.value,
      currencyOut.value,
      _amountIn
    )));
  }, [currencyIn, currencyOut]);

  const selectOptions: SelectItem[] = currenciesData.map((item) => ({
    value: item.currency,
    label: item.currency,
  }));

  return (
    <div className="appContainer">
      <img src={darkBg} alt="darkBg" className="appBgTop"/>
      <div>
        <div className="appFormContainer">
          <h5>Swap</h5>
          <div>
            <label htmlFor="currency-spend">Convert from</label>
            <Select
              classNamePrefix="styled-select"
              className="formSelect"
              placeholder="Select currency to spend"
              value={currencyIn}
              options={selectOptions}
              onChange={value => setCurrencyIn(value)}
            />
          </div>
          <div>
            <label htmlFor="currency-receive">Convert to</label>
            <Select
              classNamePrefix="styled-select"
              className="formSelect"
              placeholder="Select currency to receive"
              value={currencyOut}
              options={selectOptions}
              onChange={value => setCurrencyOut(value)}
            />
          </div>
          <div>
            <label htmlFor="input-amount">Amount to send</label>
            <input
              className="formInput"
              value={amountIn || ""}
              onChange={(e) => {
                const amount = Number(e.target.value);
                if (!currencyIn || !currencyOut || isNaN(amount)) {
                  return;
                }
                setAmountIn(e.target.value);
                setAmountOut(formatNumber(getAmountOut(
                  currencyIn.value,
                  currencyOut.value,
                  amount
                )));
              }}
            />
          </div>
          <div>
            <label htmlFor="output-amount">Amount to receive</label>
            <input
              className="formInput"
              value={amountOut || ""}
              onChange={(e) => {
                const amount = Number(e.target.value);
                if (!currencyIn || !currencyOut || isNaN(amount)) {
                  return;
                }
                setAmountOut(e.target.value);
                setAmountIn(formatNumber(getAmountIn(
                  currencyIn.value,
                  currencyOut.value,
                  amount
                )));
              }}
            />
          </div>
          <div className="note">Currency conversion is based on&nbsp;
            <a
              href="https://interview.switcheo.com/prices.json"
              target="_blank"
              rel="noopener noreferrer"
            >
              data*
            </a>
          </div>
        </div>
      </div>
      <img src={darkBg} alt="darkBg" className="appBg"/>
    </div>
  );
}

export default App;
