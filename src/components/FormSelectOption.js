const FormSelectOption = ({labelText, name, value, handleChange, list}) => {
  return (
    <div className='form-row'>
        <label htmlFor={name} className='form-label'>
            {labelText || name}
        </label>
        <select
          value={value}
          id={name}
          name={name}
          onChange={handleChange}
          className='form-select'
        >
            {list.map((itemOption, index) => {
                return (
                  <option key={index} value={itemOption}>
                    {itemOption}
                  </option>
                )
              })}
        </select>
    </div>
  )
}

export default FormSelectOption