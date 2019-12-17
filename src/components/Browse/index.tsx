import React from 'react'
import axios from 'axios'
import Search from '../Search'
// import ResultCard from '../SearchPage/ResultCard'
import { RecentCard } from '../PostCard'

interface BrowseProps {
  history: History;
}

interface BrowseState {
  isLoading: boolean;
  posts: any[];
  error: string;
}

class Browse extends React.Component<BrowseProps, BrowseState> {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      posts: null,
      error: ''
    }
  }

  componentDidMount() {
    this.fetchPosts()
  }

  fetchPosts() {
    const route = 'http://localhost:3000/api/posts'
    axios.get(route)
      .then(res => {
        this.setState({
          isLoading: false,
          posts: res.data.data.posts
        })
      })
      .catch(err => {
        let message
        if (err.response) {
          message = err.response.data.message
        } else {
          message = 'An error occurred'
        }
        console.log(message)
        this.setState({
          isLoading: false,
          error: message
        })
      })
  }

  render() {
    return (
      <div className='container text-gray-800 px-2 break-all overflow-hidden mx-auto mt-3'>
        <div className='max-w-lg mx-auto'>
          <div className='mb-2 bg-white rounded p-3 border'>
            <Search history={this.props.history} />
          </div>
        </div>
        <h1 className='text-2xl font-bold mb-2'>Recently Posted</h1>
        {/* {this.state.isLoading ? 'Loading' : JSON.stringify(this.state.posts)} */}
        {
          this.state.posts &&
          <div className='sm:-mx-1 rounded overflow-hidden'>
            <ul className='sm:flex'>
              {this.state.posts.map(data => (
                <li className='block border-b sm:border-b-0 sm:w-1/3 sm:inline-block sm:px-2 sm:mb-4' key={data.id}>
                  <RecentCard data={data} />
                  {/* <PostCard data={data} /> */}
                </li>
              ))}
            </ul>
          </div>
        }
      </div>
    )
  }
}

export default Browse
