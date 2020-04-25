import React from 'react'
import { Field, ErrorMessage } from 'formik'
import { Label, BasicInput, BasicSelect, BasicError } from '../Form/'
import {
  CLOTHING_GENDERS,
  CLOTHING_TYPES,
  CLOTHING_SIZES
} from '../../../common/constants'
import { handleNumberChange } from '../../util'

const ClothingFilters = ({ formik, isOpen }) => (
  <div className={'flex flex-col px-2 mb-3 md:max-w-xl' + (isOpen ? '' : ' hidden')}>
    <div className='flex -mx-2 mb-3'>
      <div className='w-1/2 px-2'>
        <Label labelName='Gender' />
        <Field name='articleGender' component={BasicSelect} options={['', ...Object.values(CLOTHING_GENDERS)]} />
        <ErrorMessage name='articleGender' component={BasicError} />
      </div>
      <div className='w-1/2 px-2'>
        <Label labelName='Type' />
        <Field name='articleType' component={BasicSelect} options={['', ...Object.values(CLOTHING_TYPES)]} />
      </div>
    </div>
    {
      (formik.values.articleType === CLOTHING_TYPES.PANTS || formik.values.articleType === CLOTHING_TYPES.SHORTS) ?
        <div className='flex -mx-2'>
          <div className='w-1/2 px-2'>
            <Label labelName='Waist' />
            <Field
              name='articleWaist'
              component={BasicInput}
              onChange={handleNumberChange(formik, 'articleWaist', 2)}
            />
            <ErrorMessage name='articleWaist' component={BasicError} />
          </div>
          <div className='w-1/2 px-2'>
            <Label labelName='Inseam' />
            <Field
              name='articleInseam'
              component={BasicInput}
              onChange={handleNumberChange(formik, 'articleInseam', 2)}
            />
            <ErrorMessage name='articleInseam' component={BasicError} />
          </div>
        </div> :
        <div> 
          <Label labelName='Size' />
          <Field
            name='articleSize'
            options={['', ...Object.values(CLOTHING_SIZES)]}
            component={BasicSelect}
          />
          <ErrorMessage name='size' component={BasicError} />
        </div>
    }
  </div>
)

export default React.memo(ClothingFilters)