import { useState, useEffect } from "react";
import logo from "./logo.png";
import "./App.css";

function App() {
  const [currencies, setCurrencies] = useState([]);

  // const [currencies, setCurrencies] = useState([["AED", "UAE Dirham"], ["AFN", "Afghan Afghani"], ["ALL", "Albanian Lek"], ["AMD", "Armenian Dram"], ["ANG", "Netherlands Antillian Guilder"], ["AOA", "Angolan Kwanza"]]);
  const [amount, setAmount] = useState("");
  const [currencyFrom, setCurrencyFrom] = useState("");
  const [currencyTo, setCurrencyTo] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currencies.length === 0) {
      fetch("/.netlify/functions/get-currencies-list")
        .then((response) => response.json())
        .then((data) => {
          setCurrencies([...data.supported_codes]);
        });
    }
  }, [currencies]);

  const handleSetAmount = (event) => {
    setAmount(event.target.value);
  };

  const handleSetCurrencyFrom = (event) => {
    setCurrencyFrom(event.target.value);
  };

  const handleSetCurrencyTo = (event) => {
    setCurrencyTo(event.target.value);
  };

  const handleButtonClick = (event) => {
    event.preventDefault();
    const currencyFromAbbrev = currencyFrom.split(",")[0];
    const currencyFromLong = currencyFrom.split(",")[1];
    const currencyToAbbrev = currencyTo.split(",")[0];
    const currencyToLong = currencyTo.split(",")[1];
    fetch(
      `/.netlify/functions/get-currencies?currencyFromAbbrev=${currencyFromAbbrev}&currencyToAbbrev=${currencyToAbbrev}`
    )
      .then((response) => response.json())
      .then((data) => {
        const conversionRate = data.conversion_rate;
        setMessage(
          `${amount} ${currencyFromLong}s = ${(amount * conversionRate).toFixed(
            2
          )} ${currencyToLong}s`
        );
        setAmount("");
        setCurrencyFrom("");
        setCurrencyTo("");
      })
      .catch((error) => {
        setMessage("Sorry, there was an error.");
      });
  };

  return (
    <div className="App">
      <h1 className="header">
        <a href="https://www.nowcodethis.com/" target="_blank" rel="noreferrer">
          <img className="logo img-fluid" src={logo} alt="NCT-logo" />
        </a>
        Currency Converter
      </h1>
      <form className="form form-group">
        <div className="form-row justify-content-center mx-5">
          <div className="col-md-3 mb-3">
            <label htmlFor="amount" className="label">
              Amount
            </label>
            <input
              type="number"
              className="form-control"
              id="amount"
              value={amount}
              placeholder="Enter a number"
              min="0"
              step=".01"
              onChange={(event) => {
                handleSetAmount(event);
              }}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="currency-from" className="label">
              From
            </label>
            <select
              name="currency"
              id="currency-from"
              className="form-control"
              value={currencyFrom}
              onChange={(event) => handleSetCurrencyFrom(event)}
              required
            >
              <option value="">Select Currency</option>
              {currencies.map((currency, index) => {
                return (
                  <option key={index} value={[...currency]}>
                    {currency[0]} - {currency[1]}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="currency-to" className="label">
              To
            </label>
            <select
              name="currency"
              id="currency-to"
              className="form-control"
              value={currencyTo}
              onChange={(event) => handleSetCurrencyTo(event)}
              required
            >
              <option value="">Select Currency</option>
              {currencies.map((currency, index) => {
                return (
                  <option key={index} value={[...currency]}>
                    {currency[0]} - {currency[1]}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-md-1 mt-2 mb-3">
            <button
              type="submit"
              className="btn btn-primary mt-4 mb-2 button"
              onClick={(event) => handleButtonClick(event)}
            >
              Convert
            </button>
          </div>
        </div>
      </form>
      <div>
        <h3>{message}</h3>
      </div>
    </div>
  );
}

export default App;
