import * as React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import condenseWhitespace from 'condense-whitespace'
import queryString from 'query-string'
import { BasicInput, BasicError } from '../Form'
import {
  CLOTHING_TYPES,
  HEIGHT_UNITS,
  WEIGHT_UNITS
} from '../../../common/constants'
import ClothingFilters from './ClothingFilters'
import BodyFilters from './BodyFilters'
import SearchFormInput from '../../types/search'

interface SearchProps {
  initialValues?: any;
  onSearch: Function;
}

interface SearchState {
  isClothingOpen: boolean;
  isBodyOpen: boolean;
}

class Search extends React.PureComponent<SearchProps, SearchState> {
  constructor(props) {
    super(props)
    this.state = {
      isClothingOpen: false,
      isBodyOpen: false
    }
  }

  handleClothingClick() {
    this.setState({ isClothingOpen: !this.state.isClothingOpen })
  }

  handleBodyClick() {
    this.setState({ isBodyOpen: !this.state.isBodyOpen })
  }

  render() {
    const initialValues = this.props.initialValues || {
      query: '',
      articleGender: '',
      articleType: '',
      articleSize: '',
      articleWaist: '',
      articleInseam: '',
      heightUnits: HEIGHT_UNITS.FT_IN,
      heightFeet: '',
      heightInches: '',
      heightCm: '',
      weightUnits: WEIGHT_UNITS.LBS,
      weightLbs: '',
      weightKgs: '',
      gender: ''
    }
    console.log('initial values in search form:', initialValues)

    return (
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={values => {
          this.props.onSearch(values)
        }}
      >
        {(formik) => (
          <Form className='flex flex-col justify-between flex-grow'>
            <div className='flex flex-col'>
              <div className='mb-3'>
                <h2 className='text-xl font-bold mb-1'>Search</h2>
                <Field name='query' component={BasicInput} placeholder='Search "APC Sweater"' />
                <ErrorMessage name='query' component={BasicError} />
              </div>
              <button type='button' onClick={() => this.handleClothingClick()} className='mb-1 flex items-center cursor-pointer px-1 hover:bg-gray-200 rounded mb-1'>
                <span className='mr-1' style={{transform: this.state.isClothingOpen ? '' : 'rotate(-90deg)'}}>
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path>
                  </svg>
                </span>
                <h2 className='font-semibold text-sm'>Clothing Filters</h2>
              </button>
              <ClothingFilters formik={formik} isOpen={this.state.isClothingOpen} />
              <button type='button' onClick={() => this.handleBodyClick()} className='mb-1 flex items-center cursor-pointer px-1 hover:bg-gray-200 rounded mb-1'>
                <span className='mr-1' style={{transform: this.state.isBodyOpen ? '' : 'rotate(-90deg)'}}>
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path>
                  </svg>
                </span>
                <h2 className='font-semibold text-sm'>Body Filters</h2>
              </button>
              <BodyFilters formik={formik} isOpen={this.state.isBodyOpen} />
            </div>
            <div className='mt-2 flex flex-row-reverse'>
              <button
                type='submit'
                className='items-center flex bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
              >
                <svg className="mr-1 fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                  <path d="M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"></path>
                </svg>
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
    )
  }
}

export default Search
