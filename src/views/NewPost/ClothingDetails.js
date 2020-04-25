import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Label, BasicInput, BasicSelect, BasicError, FormButton } from '../../components/Form'
import { CLOTHING_TYPES, CLOTHING_GENDERS, CLOTHING_SIZES } from '../../../common/constants'
import validate from '../../../common/validators/clothing'
import { handleNumberChange } from '../../util'

const ClothingDetailsContainer = ({ formValues, onNextClick }) => {
  return (
    <Formik
      initialValues={formValues}
      validate={validate}
      onSubmit={values => {
        onNextClick(values)
      }}
    >
      {(formik) => (
        <Form className='flex flex-col justify-between flex-grow'>
          <div className='flex flex-col'>
            <div className='mb-3'>
              <Label labelName='Brand' />
              <Field name='brand' component={BasicInput} />
              <ErrorMessage name='brand' component={BasicError} />
            </div>
            <div className='mb-3'>
              <Label labelName='Article Name' />
              <Field name='name' component={BasicInput} />
              <ErrorMessage name='name' component={BasicError} />
            </div>
            <div className='mb-3'>
              <Label labelName='Gender' />
              <Field name='gender' component={BasicSelect} options={Object.values(CLOTHING_GENDERS)} />
              <ErrorMessage name='gender' component={BasicError} />
            </div>
            <div className='mb-3'>
              <Label labelName='Type' />
              <Field name='type' component={BasicSelect} options={Object.values(CLOTHING_TYPES)} />
              <ErrorMessage name='type' component={BasicError} />
            </div>
            {
              (formik.values.type === CLOTHING_TYPES.PANTS || formik.values.type === CLOTHING_TYPES.SHORTS) ?
              <div className='flex mb-3 -mx-2'>
                <div className='w-1/2 px-2'>
                  <Label labelName='Waist' />
                  <Field
                    name='waist'
                    component={BasicInput}
                    onChange={handleNumberChange(formik, 'waist', 2)}
                  />
                  <ErrorMessage name='waist' component={BasicError} />
                </div>
                <div className='w-1/2 px-2'>
                  <Label labelName='Inseam' />
                  <Field
                    name='inseam'
                    component={BasicInput}
                    onChange={handleNumberChange(formik, 'inseam', 2)}
                  />
                  <ErrorMessage name='inseam' component={BasicError} />
                </div>
              </div> :
              <div className='mb-3'>
                <Label labelName='Size' />
                <Field
                  name='size'
                  options={Object.values(CLOTHING_SIZES)}
                  component={BasicSelect}
                />
                <ErrorMessage name='size' component={BasicError} />
              </div>
            }
          </div>
          <div className='flex flex-row-reverse'>
            <FormButton text='Body Information' direction='next' type='submit' />
          </div>
        </Form>
      )}
    </Formik>
  )
}

const ClothingDetails = ({ formValues, onNextClick }) => {
  return (
    <section className='p-3 h-full flex flex-col'>
      <h1 className='text-2xl font-bold mb-3'>Clothing Details</h1>
      <ClothingDetailsContainer formValues={formValues} onNextClick={onNextClick} />
    </section>
  )
}

export default React.memo(ClothingDetails)
