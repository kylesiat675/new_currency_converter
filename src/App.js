import React, {useEffect, useState} from 'react';
import './App.css';
import CurrencyItem from './components/CurrencyItem';
const BASE_CURRENCY = 'cad'
const CURRENCY_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-10-23/v1/currencies/'

function App() {
  const [currencyList, setCurrencyList] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  const optionsList=
  currencyList.map((e)=>({
    value: e,
    label: e.toUpperCase(),
  }))

  let toAmount, fromAmount
  if(amountInFromCurrency){
    fromAmount = amount
    toAmount = amount*exchangeRate
  }else{
    toAmount = amount
    fromAmount = amount/exchangeRate
  }

  useEffect(() =>{
    fetch(`${CURRENCY_URL}${BASE_CURRENCY}.json`)
      .then(response=>response.json())
      .then(data=>{
        //Takes the current type of currency (initialized to CAD)
        let currentCurrency = Object.keys(data)[1]
        const firstCurrency = Object.keys(data[currentCurrency])[0]
        setCurrencyList([...Object.keys(data[currentCurrency])])
        setFromCurrency(currentCurrency)
        setToCurrency(firstCurrency)
        setExchangeRate(data[currentCurrency][firstCurrency])
      })
  }, [])
  useEffect(()=>{
    if(fromCurrency != null && toCurrency != null){
      fetch(`${CURRENCY_URL}${fromCurrency}.json`)
        .then(response=>response.json())
        .then(data=>{
          setExchangeRate(data[fromCurrency][toCurrency])
       })
    }
  },[fromCurrency,toCurrency])
  function handleFromAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }
  function handleToAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }
  function handleSwapCurrencies(e){
    let temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }
  return (
    <>
      <h1>Crypto/Currency Converter</h1>
      {/*First Currency */}
      <CurrencyItem
        optionsList={optionsList}
        selectedCurrency={optionsList.find(option=>option.value===fromCurrency)}
        onChangeCurrency={e=>setFromCurrency(e.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      {/*Second Currency */}
      <CurrencyItem
        optionsList={optionsList}
        selectedCurrency={optionsList.find(option=>option.value===toCurrency)}
        onChangeCurrency={e=>setToCurrency(e.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
      <button onClick={handleSwapCurrencies}>Swap</button>
    </>
  );
}

export default App;