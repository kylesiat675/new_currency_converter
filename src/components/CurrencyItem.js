import React from 'react'
import Select from 'react-select'

export default function CurrencyItem(props) {
const{optionsList, selectedCurrency, onChangeCurrency, onChangeAmount, amount} = props
return (
    <div>
        <input type="number" placeholder="0" className="input" value={amount || 1} onChange={onChangeAmount}/>

        <Select
        options={
          optionsList
        }
        value={selectedCurrency}
        onChange={onChangeCurrency}
        className="select"
        isSearchable/>
        {/* <select value={selectedCurrency} onChange={onChangeCurrency} className="select">
            {currencyList.map((list)=> (
                <option key={list} value={list}>{list.toUpperCase()}</option>
            ))}
        </select> */}
    </div>
  )
}
