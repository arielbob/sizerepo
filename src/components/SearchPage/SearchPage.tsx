import React from 'react'
import axios from 'axios'
import queryString from 'query-string'
import Search from '../Search/Search'
import { ResultCard } from '../PostCard'
import { API_URL } from '../../../common/constants'
import SearchFormInput from '../../types/search'
import { SearchQueryParams, SearchData } from '../../types/search'
import { convertSearchFormValuesToQueryParams, generateQueryHeight, convertQueryParamsToFormValues, convertQueryParamsToSearchData } from '../../util'
import { FormButton } from '../Form'
import { Link } from 'react-router-dom'

interface SearchPageState {
  isLoading: boolean,
  results: any[],
  page: number,
  hasPrev: boolean,
  hasNext: boolean,
  searchValues: SearchFormInput,
  error: string
}

class SearchPage extends React.Component<any, SearchPageState> {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      results: null,
      page: null,
      hasPrev: null,
      hasNext: null,
      searchValues: null,
      error: ''
    }
  }

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

  updateSearchURL(values: SearchFormInput, resetPagination: boolean) {
    // create query string from search form values
    if (resetPagination) values.page = '1'
    const searchQueryParams = convertSearchFormValuesToQueryParams(values)
    const queryStr = queryString.stringify(searchQueryParams, { skipNull: true })
    this.props.history.push('/search?' + queryStr)
  }

  handleSearch(values: SearchFormInput) {
    this.setState({
      isLoading: true
    })

    // create query string from search form values
    const searchQueryParams = convertSearchFormValuesToQueryParams(values)

    // create search API request object from query params
    const searchData: SearchData = convertQueryParamsToSearchData(searchQueryParams)
    const apiQueryStr = queryString.stringify(searchData, { skipNull: true })

    const route = API_URL + '/api/search' + (apiQueryStr[0] === '?' ? '' : '?') + apiQueryStr
    axios.get(route)
      .then(res => {
        const { results, page, hasPrev, hasNext } = res.data.data
        this.setState({
          results,
          page,
          hasPrev,
          hasNext,
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

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      const query: SearchQueryParams = queryString.parse(this.props.location.search) as any
      this.handleSearch(convertQueryParamsToFormValues(query))
    }
  }

  getQueryStringForPage(page: number) {
    const query: SearchQueryParams = queryString.parse(this.props.location.search) as any
    query.page = '' + page
    
    return queryString.stringify(query)
  }

  render() {
    console.log(this.props.match.params)
    return (
      <div className='container text-gray-800 px-2 break-all overflow-hidden mx-auto my-8'>
        <div className='-mx-2 flex flex-col md:flex-row'>
          <section className='w-full px-2 md:max-w-xl mx-auto mb-4 md:w-1/3 md:pt-8'> 
            <div className='bg-white border rounded p-3 sticky'>
              <Search initialValues={this.state.searchValues} onSearch={(data) => this.updateSearchURL(data, true)} />
            </div>
          </section>
          <section className='w-full px-2 md:w-2/3'> 
            <h2 className='text-xl font-bold mb-1'>Results</h2>
            { this.state.isLoading && <h2>Loading...</h2> }
            {
              !this.state.error && !this.state.isLoading && this.state.results &&
              <>
                {
                  this.state.results.length == 0 ? <h2>No posts found</h2> :
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
                { !!this.state.results.length && !this.state.hasNext && <p className='mt-2'>No more results</p> }
                <div className='mt-3 flex justify-between'>
                  <div>
                    {
                      this.state.hasPrev &&
                      <Link to={'/search?' + this.getQueryStringForPage(this.state.page - 1)}>
                        <FormButton onClick={null} text='Previous' direction='prev' type='button' disabled={false} />
                      </Link>
                    }
                  </div>
                  <div>
                    {
                      this.state.hasNext &&
                      <Link to={'/search?' + this.getQueryStringForPage(this.state.page + 1)}>
                        <FormButton onClick={null} text='Next' direction='next' type='button' disabled={false} />
                      </Link>
                    }
                  </div>
                </div>
              </>
            }
            { !this.state.isLoading && this.state.error && <h2>{this.state.error}</h2> }
          </section>
        </div>
      </div>
    )
  }
}

export default SearchPage
