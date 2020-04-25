import React from 'react'
import axios from 'axios'
import queryString from 'query-string'
import Search from '../../components/Search/Search'
import { RecentCard } from '../../components/PostCard'
import SearchFormInput from '../../types/search'
import { convertSearchFormValuesToQueryParams } from '../../util'
import { API_URL, UNITS } from '../../../common/constants'

interface BrowseProps {
  history: any;
  units: UNITS;
}

interface BrowseState {
  isLoading: boolean,
  posts: any[],
  error: string
}

class Browse extends React.Component<BrowseProps, BrowseState> {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      posts: null,
      error: ''
    }
    this.handleSearch = this.handleSearch.bind(this)
  }

  componentDidMount() {
    this.fetchPosts()
  }

  fetchPosts() {
    const route = API_URL + '/api/posts'
    axios.get(route)
      .then(res => {
        this.setState({
          isLoading: false,
          posts: res.data.data.posts,
          error: ''
        })
      })
      .catch(err => {
        this.setState({
          error: err.response ? err.response.data.message : 'Could not fetch recent posts'
        })
      })
      .finally(() => {
        this.setState({
          isLoading: false
        })
      })
  }

  handleSearch(values: SearchFormInput) {
    const searchQueryParams = convertSearchFormValuesToQueryParams(values)
    const queryStr = queryString.stringify(searchQueryParams, { skipNull: true })
    this.props.history.push('/search?' + queryStr)
  }

  render() {
    return (
      <div className='container px-2 break-all overflow-hidden mx-auto my-8'>
        <div className='w-full md:max-w-lg mx-auto'>
          <div className='mb-8 bg-white rounded p-3'>
            <Search onSearch={this.handleSearch} />
          </div>
        </div>
        <div className='rounded overflow-hidden scrollbar-hidden'>
          <h1 className='text-xl font-bold mb-2'>Recently Posted</h1>
          { this.state.isLoading && <h2>Loading...</h2> }
          {
            !this.state.error && !this.state.isLoading && this.state.posts &&
            <>
              { this.state.posts.length === 0 ? <h2>No recent posts</h2> : 
              <div className='md:border-0 md:-mx-1 rounded overflow-hidden scrollbar-hidden'>
                <ul className='overflow-x-auto whitespace-no-wrap scrolling-touch'>
                  {this.state.posts.map(data => (
                    <li className='block border-b md:border-b-0 last:border-b-0 md:w-56 lg:w-1/5 md:inline-block md:px-2' key={data.id}>
                      <RecentCard units={this.props.units} data={data} />
                    </li>
                  ))}
                </ul>
              </div>
              }
            </>
          }
          { this.state.error && <h2>{this.state.error}</h2> }
        </div>
      </div>
    )
  }
}

export default Browse
