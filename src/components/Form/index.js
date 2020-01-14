import React from 'react'

export const Label = ({ labelName }) => (
  <label className='block text-sm mb-1 text-gray-800'>{labelName}</label>
)

export const BasicInput = ({ field, form: { touched, errors }, suffix, onChange, placeholder }) => {
  const borderClass = (touched[field.name] && errors[field.name]) ? 'border-red-200' : 'border-gray-200'
  return (
    <div className='relative'>
      <input
        className={'border px-3 py-1 pr-8 leading-tight rounded w-full ' + borderClass}
        {...field}
        onChange={onChange || field.onChange}
        placeholder={placeholder || null}
      />
      {
        suffix &&
        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500'>
          { suffix }
        </div>
      }
    </div>
  )
}

export const BasicSelect = ({ field, form: { touched, errors }, options }) => {
  const borderClass = (touched[field.name] && errors[field.name]) ? 'border-red-200' : 'border-gray-200'
  return (
    <div className='relative'>
      <select
        className={'block appearance-none border px-3 py-1 pr-8 rounded leading-tight w-full ' + borderClass}
        {...field}
      >
        {options.map((optionText, i) => <option key={i}>{optionText}</option>)}
      </select>
      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
        <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/></svg>
      </div>
    </div>
  )
}

// formik puts error message as child of component prop in ErrorMessage
export const BasicError = ({ children }) => <p className='text-italic text-red-500 text-sm'>{children}</p>

export const FormButton = ({ text, direction, onClick, type, disabled }) => {
  let ArrowSymbol
  if (direction) {
    if (direction === 'next') {
      ArrowSymbol = <svg className='inline fill-current h-4 w-4 ml-2' xmlns='http://www.w3.org/2000/svg' viewBox='0 4 20 20'>
          <path d='M5 13h11.86l-3.63 4.36a1 1 0 0 0 1.54 1.28l5-6a1.19 1.19 0 0 0 .09-.15c0-.05.05-.08.07-.13A1 1 0 0 0 20 12a1 1 0 0 0-.07-.36c0-.05-.05-.08-.07-.13a1.19 1.19 0 0 0-.09-.15l-5-6A1 1 0 0 0 14 5a1 1 0 0 0-.64.23 1 1 0 0 0-.13 1.41L16.86 11H5a1 1 0 0 0 0 2z' />
        </svg>
    } else {
      ArrowSymbol = <svg className='inline fill-current h-4 w-4 mr-2' xmlns='http://www.w3.org/2000/svg' viewBox='0 4 20 20'>
          <path d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0 0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0 .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23 1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2z" />
        </svg>
    }
  }

  return (
    <button
      type={type || 'button'}
      className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-4 border border-blue-500 hover:border-transparent rounded disabled:opacity-50 disabled:cursor-not-allowed'
      onClick={onClick}
      disabled={disabled}
    >
      { direction === 'prev' ? ArrowSymbol : null }
      { text }
      { direction === 'next' ? ArrowSymbol : null }
    </button>
  )
}
