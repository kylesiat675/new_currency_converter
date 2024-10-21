import React from 'react'

export default function CurrencyItem(props) {
  const{currencyList, selectedCurrency, onChangeCurrency, onChangeAmount, amount} = props
  return (
    <div>
        <input type="number" placeholder="0" className="input" value={amount || 1} onChange={onChangeAmount}/>
        <select value={selectedCurrency} onChange={onChangeCurrency}>
          {currencyList.map((list)=>(
            <option key={list} value={list}>{list.toUpperCase()}</option>
          ))}
        </select>
    </div>
  )
}
