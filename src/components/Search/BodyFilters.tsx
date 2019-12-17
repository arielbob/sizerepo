import * as React from 'react'
import { Field, ErrorMessage } from 'formik'
import { Label, BasicInput, BasicSelect, BasicError } from '../Form/'
import {
  GENDERS,
  HEIGHT_UNITS,
  WEIGHT_UNITS
} from '../../../common/constants'
import { handleNumberChange } from '../../util'

const BodyFilters = ({ formik, isOpen }) => (
  <div className={'mb-3 flex flex-col md:max-w-md' + (isOpen ? '' : ' hidden')}>
    <div className='flex -mx-2'>
      <div className='w-1/3 px-2'><Label labelName='Height' /></div>
      {formik.values.heightUnits === 'ft/in' ? <div className='w-1/3 px-2'></div> : null}
      <div className='w-1/3 px-2'><Label labelName='Units' /></div>
    </div>
    <div className='flex mb-3 -mx-2'>
      {
        formik.values.heightUnits === 'ft/in' ?
        <>
          <div className='w-1/3 px-2'>
            <Field
              name='heightFeet'
              onChange={handleNumberChange(formik, 'heightFeet', 1)}
              component={BasicInput}
              suffix='ft' />
            <ErrorMessage name='heightFeet' component={BasicError} />
          </div>
          <div className='w-1/3 px-2'>
            <Field
              name='heightInches'
              onChange={handleNumberChange(formik, 'heightInches', 2)}
              component={BasicInput}
              suffix='in' />
            <ErrorMessage name='heightInches' component={BasicError} />
          </div>
          <div className='w-1/3 px-2'>
            <Field name='heightUnits' component={BasicSelect} options={Object.values(HEIGHT_UNITS)} />
          </div>
        </> :
        <>
          <div className='w-1/3 px-2'>
            <Field
              name='heightCm'
              onChange={handleNumberChange(formik, 'heightCm', 3)}
              component={BasicInput}
              suffix='cm' />
            <ErrorMessage name='heightCm' component={BasicError} />
          </div>
          <div className='w-1/3 px-2'>
            <Field name='heightUnits' component={BasicSelect} options={Object.values(HEIGHT_UNITS)} />
          </div>
          <div className='w-1/3 px-2'>
          </div>
        </>
      }
    </div>
    <div className='flex -mx-2'>
      <div className='w-1/3 px-2'>
        <Label labelName='Weight' />
      </div>
      <div className='w-1/3 px-2'>
        <Label labelName='Units' />
      </div>
    </div>
    <div className='flex mb-3 -mx-2'>
      {
        formik.values.weightUnits === 'lbs' ?
        <>
          <div className='w-1/3 px-2'>
            <Field
              name='weightLbs'
              onChange={handleNumberChange(formik, 'weightLbs', 4)}
              component={BasicInput}
              suffix='lbs' />
            <ErrorMessage name='weightLbs' component={BasicError} />
          </div>
          <div className='w-1/3 px-2'>
            <Field name='weightUnits' component={BasicSelect} options={Object.values(WEIGHT_UNITS)} />
          </div>
        </> :
        <>
          <div className='w-1/3 px-2'>
            <Field
              name='weightKgs'
              onChange={handleNumberChange(formik, 'weightKgs', 3)}
              component={BasicInput}
              suffix='kgs' />
            <ErrorMessage name='weightKgs' component={BasicError} />
          </div>
          <div className='w-1/3 px-2'>
            <Field name='weightUnits' component={BasicSelect} options={Object.values(WEIGHT_UNITS)} />
          </div>
        </>
      }
    </div>
    <div className='mb-3'>
      <Label labelName='Gender' />
      <Field name='gender' options={['', ...Object.values(GENDERS)]} component={BasicSelect} />
    </div>
  </div>
)

export default BodyFilters