import * as React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import condenseWhitespace from 'condense-whitespace'
import queryString from 'query-string'
import { BasicInput, BasicError } from '../Form/'
import {
  CLOTHING_TYPES,
  HEIGHT_UNITS,
  WEIGHT_UNITS
} from '../../../common/constants'
import ClothingFilters from './ClothingFilters'
import BodyFilters from './BodyFilters'

const removeExtraneousData = (clothing) => {
  console.log('before removeExtraneous:', clothing)
  if (clothing.type === CLOTHING_TYPES.PANTS || clothing.type === CLOTHING_TYPES.SHORTS) {
    clothing.size = null
  } else {
    clothing.waist = null
    clothing.inseam = null
  }
  console.log('after removeExtraneous:', clothing)
}

const convertUnits = (body) => {
  // convert height to metres
  if (body.heightUnits === HEIGHT_UNITS.FT_IN) {
    if (!body.heightFeet && !body.heightInches) return

    const heightFeet = isNaN(parseInt(body.heightFeet)) ? 0 : body.heightFeet
    const heightInches = isNaN(parseInt(body.heightInches)) ? 0 : body.heightInches

    const inches = parseInt(heightFeet, 10) * 12 + parseInt(heightInches)
    body.height = (0.0254 * inches).toFixed(3)
  } else {
    if (!body.heightCm) return
    const heightCm = isNaN(parseInt(body.heightCm)) ? 0 : body.heightCm
    body.height = (parseInt(heightCm) / 100).toFixed(3)
  }

  // convert weight to kgs
  if (body.weightUnits === WEIGHT_UNITS.LBS) {
    if (!isNaN(parseInt(body.weightLbs))) {
      body.weight = (0.45359237 * parseInt(body.weightLbs)).toFixed(3)
    }
  } else {
    if (!isNaN(parseInt(body.weightKgs))) {
      body.weight = parseInt(body.weightKgs).toFixed(3)
    }
  }
}

const convertGenders = (clothing, body) => {
  if (clothing.gender) clothing.gender = clothing.gender[0].toLowerCase()
  if (body.gender) body.gender = body.gender[0].toLowerCase()
}

const convertArticleType = (clothing) => {
  if (clothing.type) clothing.type = clothing.type.toLowerCase()
}

const convertArticleSize = (clothing) => {
  if (clothing.size) clothing.size = clothing.size.toLowerCase()
}

class Search extends React.Component {
  constructor() {
    super()
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

  handleSubmit(values) {
    const body = {
      gender: values.gender,
      heightUnits: values.heightUnits,
      heightFeet: values.heightFeet,
      heightInches: values.heightInches,
      heightCm: values.heightCm,
      weightUnits: values.weightUnits,
      weightLbs: values.weightLbs,
      weightKgs: values.weightKgs
    }
    const clothing = {
      gender: values.articleGender,
      type: values.articleType,
      size: values.articleSize,
      waist: values.articleWaist,
      inseam: values.articleInseam
    }
    removeExtraneousData(clothing)
    convertUnits(body)
    convertGenders(clothing, body)
    convertArticleType(clothing)
    convertArticleSize(clothing)

    const data = {
      query: condenseWhitespace(values.query) || null,
      page: 1,
      article_gender: clothing.gender || null,
      type: clothing.type || null,
      size: clothing.size || null,
      waist: clothing.waist || null,
      inseam: clothing.inseam || null,
      height: body.height || null,
      weight: body.weight || null,
      gender: body.gender || null
    }

    const queryStr = queryString.stringify(data, { skipNull: true })
    console.log(queryStr)
    console.log(data)
    console.log(this.props)
    this.props.history.push('/search?' + queryStr)
    if (this.props.onSearch) this.props.onSearch(queryStr)
  }

  render() {
    return (
      <Formik
        initialValues={{
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
        }}
        // validate={validate}
        onSubmit={values => {
          this.handleSubmit(values)
        }}
      >
        {(formik) => (
          <Form className='flex flex-col justify-between flex-grow'>
            <div className='flex flex-col'>
              <div className='mb-3'>
                <h2 className='text-lg font-bold mb-1'>Search</h2>
                <Field name='query' component={BasicInput} />
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
