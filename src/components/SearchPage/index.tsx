import React from 'react'
import axios from 'axios'
import queryString from 'query-string'
import Search from '../Search'
import { ResultCard } from '../PostCard'

class SearchPage extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      results: null
    }
  }

  componentDidMount() {
    this.handleSearch(this.props.location.search)
  }

  handleSearch(queryStr) {
    this.setState({ isLoading: true })
    axios.get('http://localhost:3000/api/search' + (queryStr[0] === '?' ? '' : '?') + queryStr)
      .then(res => {
        this.setState({ results: res.data.data.results })
        console.log(res.data.data)
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        this.setState({ isLoading: false })
      })
  }

  render() {
    return (
      <div className='container text-gray-800 px-2 break-all overflow-hidden mx-auto mt-3'>
        <div className='-mx-2 flex flex-col md:flex-row'>
          <section className='w-full px-2 md:max-w-xl mx-auto md:w-1/3 md:pt-10'> 
            <div className='bg-white border rounded p-2 sticky'>
              <Search onSearch={(queryStr) => this.handleSearch(queryStr)} history={this.props.history} />
            </div>
          </section>
          <section className='w-full md:w-2/3'> 
            <div className='p-2'>
              <h2 className='text-lg font-bold mb-1'>Results</h2>
              {
                !this.state.isLoading && this.state.results &&
                <ul className='rounded overflow-hidden border sm:border-0 sm:flex sm:flex-wrap sm:-mx-2'>
                  {this.state.results.map(result => {
                    const { id, data } = result
                    return (
                      <li className='w-full border-b last:border-b-0 sm:border-none sm:px-1 sm:mb-2 sm:w-1/3 lg:w-1/4' key={id}>
                        <ResultCard data={data} />
                      </li>
                    )
                  })}
                </ul>
              }
            </div>
          </section>
        </div>
        { this.state.isLoading && 'Loading...' }
      </div>
    )
  }
}

export default SearchPage
