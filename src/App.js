import React, {useEffect, useState} from 'react';
import './App.css';
import CurrencyItem from './components/CurrencyItem';
//Change BASE_CURRENCY to change the base currency of the application
const BASE_CURRENCY = 'cad'

//The API uses changes daily so we take the current date today and format it towards Ahmed's API
//then combine it back to the Content Delivery Network URL he provided so the application can be
//updated daily as well.
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth()+1;
const day = today.getDate();
const currentDate = year+'-'+month+'-'+day;
const CURRENCY_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@'+currentDate+'/v1/currencies/'

function App() {
  const [currencyList, setCurrencyList] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(0)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  //Map out the data taken from currencyList into react-select formatting (value: a, label: b)
  const optionsList = currencyList.map((e)=>({
    value: e,
    label: e.toUpperCase(),
  }))

  //Exchange rate calculation with the user input
  let toAmount, fromAmount
  if(amountInFromCurrency){
    fromAmount = amount
    toAmount = amount*exchangeRate
  }else{
    toAmount = amount
    fromAmount = amount/exchangeRate
  }

  //Initialize the list of currencies and the initial exchange rate from the base currency to the next one
  useEffect(() =>{
    fetch(`${CURRENCY_URL}${BASE_CURRENCY.toLowerCase()}.json`)
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

  //Hook that happens when the user changes the currency for either select tabs
  useEffect(()=>{
    if(fromCurrency != null && toCurrency != null){
      fetch(`${CURRENCY_URL}${fromCurrency}.json`)
        .then(response=>response.json())
        .then(data=>{
          setExchangeRate(data[fromCurrency][toCurrency])
       })
    }
  },[fromCurrency,toCurrency])

  //Changes the fromAmount if boolean useState setAmountInFromCurrency is true
  function handleFromAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  //Changes the toAmount if boolean useState setAmountInFromCurrency is false
  function handleToAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  //Swap currencies button functionality
  function handleSwapCurrencies(e){
    let temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }
  return (
    <>
      <div className='converter'>
        <h1>Crypto/Currency Converter</h1>
        {/*From Currency*/}
        <CurrencyItem
          optionsList={optionsList}
          selectedCurrency={optionsList.find(option=>option.value===fromCurrency)}
          onChangeCurrency={e=>setFromCurrency(e.value)}
          onChangeAmount={handleFromAmountChange}
          amount={fromAmount}
        />
        <div className="equals">=</div>
        {/*To Currency*/}
        <CurrencyItem
          optionsList={optionsList}
          selectedCurrency={optionsList.find(option=>option.value===toCurrency)}
          onChangeCurrency={e=>setToCurrency(e.value)}
          onChangeAmount={handleToAmountChange}
          amount={toAmount}
        />
        <button onClick={handleSwapCurrencies}>Swap</button>
      </div>
    </>
  );
}

export default App;