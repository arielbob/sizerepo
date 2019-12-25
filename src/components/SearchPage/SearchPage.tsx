import React from 'react'
import axios from 'axios'
import queryString from 'query-string'
import Search from '../Search/Search'
import { ResultCard } from '../PostCard'
import { HEIGHT_UNITS, WEIGHT_UNITS, CLOTHING_GENDERS_SHORT_TO_FULL, QUERY_PARAM_TO_HEIGHT_UNITS, QUERY_PARAM_TO_WEIGHT_UNITS, GENDERS_SHORT_TO_FULL } from '../../../common/constants'
import SearchFormInput from '../../types/search'
import querySchema from '../../../common/validators/search-query'
import { SearchQueryParams, SearchData } from '../../types/search'
import { convertSearchFormValuesToQueryParams } from '../../util'

// convert height to metres and return valid string
// if invalid input, or missing sufficient values, returns null
const generateQueryHeight = (heightUnits, heightFeet, heightInches, heightCm): string => {
  let valid
  if (heightUnits === HEIGHT_UNITS.FT_IN) {
    if (!heightFeet && !heightInches) return null

    const parsedFeet = parseInt(heightFeet, 10)
    const parsedInches = parseInt(heightInches, 10)

    const validFeet = isNaN(parsedFeet) ? null : parsedFeet
    const validInches = isNaN(parsedInches) ? null : parsedInches

    let inches = 0
    if (validFeet) { inches += validFeet * 12 } 
    if (validInches) { inches += validInches }

    if (validFeet || validInches) valid = (inches / 39.37).toFixed(3)
  } else {
    if (!heightCm) return

    const parsed = parseInt(heightCm, 10)
    valid = isNaN(parsed) ? null : (parsed / 100).toFixed(3)
  }
  
  return valid
}

// convert weight to kg and return valid string
// if invalid input, returns null
const generateQueryWeight = (weightUnits, weightLbs, weightKgs): string => {
  let valid = null

  if (weightUnits === WEIGHT_UNITS.LBS) {
    if (!isNaN(parseInt(weightLbs))) {
      valid = (0.45359237 * parseInt(weightLbs)).toFixed(3)
    }
  } else {
    if (!isNaN(parseInt(weightKgs))) {
      valid = parseInt(weightKgs).toFixed(3)
    }
  }

  return valid
}

const convertQueryParamsToFormValues = (query: SearchQueryParams): SearchFormInput => {
  console.log('query before converting to form values:', query)
  if (querySchema.isValidSync(query)) {
    const heightUnits = QUERY_PARAM_TO_HEIGHT_UNITS[query.height_units] || HEIGHT_UNITS.FT_IN
    let heightFeet = ''
    let heightInches = ''
    let heightCm = ''
    if (heightUnits === HEIGHT_UNITS.FT_IN) {
      if (query.height_ft) heightFeet = query.height_ft
      if (query.height_in) heightInches = query.height_in
    } else {
      if (query.height_cm) heightCm = query.height_cm
    }

    const weightUnits = QUERY_PARAM_TO_WEIGHT_UNITS[query.weight_units] || WEIGHT_UNITS.LBS
    let weightLbs = ''
    let weightKgs = ''
    if (weightUnits === WEIGHT_UNITS.LBS) {
      if (query.weight_lbs) weightLbs = query.weight_lbs
    } else {
      if (query.weight_kgs) weightKgs = query.weight_kgs
    }

    return {
      query: query.query || '', 
      articleGender: CLOTHING_GENDERS_SHORT_TO_FULL[query.article_gender] || '',
      articleType: (query.type && (query.type[0].toUpperCase() + query.type.slice(1))) || '',
      articleSize: (query.size && query.size.toUpperCase()) || '',
      articleWaist: query.waist || '',
      articleInseam: query.inseam || '',
      heightUnits: heightUnits,
      heightFeet,
      heightInches,
      heightCm,
      weightUnits,
      weightLbs,
      weightKgs,
      gender: GENDERS_SHORT_TO_FULL[query.gender] || ''
    }
  } else {
    return {
      query: '', 
      articleGender: '',
      articleType: '',
      articleSize: '',
      articleWaist: '',
      articleInseam: '',
      heightUnits: '',
      heightFeet: '',
      heightInches: '',
      heightCm: '',
      weightUnits: '',
      weightLbs: '',
      weightKgs: '',
      gender: '' 
    }
  }
}

const convertQueryParamsToSearchData = (params: SearchQueryParams): SearchData => {
  const searchData: SearchData = {
    query: params.query,
    page: 1,
    article_gender: params.article_gender,
    type: params.type,
    size: params.type,
    waist: params.waist,
    inseam: params.inseam,
    height: generateQueryHeight(params.height_units, params.height_ft, params.height_in, params.height_cm),
    weight: generateQueryWeight(params.weight_units, params.weight_lbs, params.weight_kgs),
    gender: params.gender
  }

  return searchData
}

interface SearchPageState {
  isLoading: boolean,
  results: any[],
  searchValues: SearchFormInput,
  error: string
}

class SearchPage extends React.Component<any, SearchPageState> {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      results: null,
      searchValues: null,
      error: ''
    }
  }

  // NOTE: we may be able to move this logic to the Search component
  // this would reduce re-renderings, since Search component mounts before SearchPage (since Search is a child of SearchPage)
  componentDidMount() {
    // when we mount, we have the query string
    // we have to convert it to form schema to set the form to the values from the url
    const query: SearchQueryParams = queryString.parse(this.props.location.search) as any

    // convert query params to initial form values
    const initialFormValues: SearchFormInput = convertQueryParamsToFormValues(query)
    console.log('initial form values:', initialFormValues)

    this.setState({
      searchValues: initialFormValues
    })
    this.handleSearch(initialFormValues)
  }

  handleSearch(values: SearchFormInput) {
    this.setState({
      isLoading: true
    })

    // create query string from search form values
    const searchQueryParams = convertSearchFormValuesToQueryParams(values)
    const queryStr = queryString.stringify(searchQueryParams, { skipNull: true })
    this.props.history.push('/search?' + queryStr)

    // create search API request object from query params
    const searchData: SearchData = convertQueryParamsToSearchData(searchQueryParams)
    const apiQueryStr = queryString.stringify(searchData, { skipNull: true })

    console.log('query string:', queryStr)
    console.log('api query string:', apiQueryStr)
    // console.log('search data:', searchData)

    axios.get('http://localhost:3000/api/search' + (apiQueryStr[0] === '?' ? '' : '?') + apiQueryStr)
      .then(res => {
        this.setState({
          results: res.data.data.results,
          error: ''
        })
        console.log(res.data.data)
      }).catch(err => {
        this.setState({
          error: err.response ? err.response.data.message : 'Could not fetch results'
        })
        console.error(err)
      }).finally(() => {
        this.setState({ isLoading: false })
      })
  }

  render() {
    return (
      <div className='container text-gray-800 px-2 break-all overflow-hidden mx-auto my-8'>
        <div className='-mx-2 flex flex-col md:flex-row'>
          <section className='w-full px-2 md:max-w-xl mx-auto mb-4 md:w-1/3 md:pt-8'> 
            <div className='bg-white border rounded p-3 sticky'>
              <Search initialValues={this.state.searchValues} onSearch={(data) => this.handleSearch(data)} />
            </div>
          </section>
          <section className='w-full px-2 md:w-2/3'> 
            <h2 className='text-xl font-bold mb-1'>Results</h2>
            { this.state.isLoading && <h2>Loading...</h2> }
            {
              !this.state.error && !this.state.isLoading && this.state.results &&
              <>
                { this.state.results.length == 0 ? <h2>No posts found</h2> :
                  <ul className='rounded overflow-hidden border sm:border-0 sm:flex sm:flex-wrap sm:-mx-2'>
                    {this.state.results.map(result => {
                      const { id, data } = result
                      // just because id isn't in the _source object in elasticsearch
                      data.id = id
                      return (
                        <li className='w-full border-b last:border-b-0 sm:border-none sm:px-1 sm:mb-2 sm:w-1/3 lg:w-1/4' key={id}>
                          <ResultCard data={data} />
                        </li>
                      )
                    })}
                  </ul>
                }
              </>
            }
            { this.state.error && <h2>{this.state.error}</h2> }
          </section>
        </div>
      </div>
    )
  }
}

export default SearchPage
