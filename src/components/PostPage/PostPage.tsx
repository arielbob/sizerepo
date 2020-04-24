import React from 'react'
import axios from 'axios'
import PostData from '../../types/post-data'
import { buildSizingString, capFirst } from '../../util'
import { metresToFeetString, metresToCmString, kgsToLbsString, kgsToKgsString } from '../../../common/util'
import { CLOTHING_GENDERS_SHORT_TO_FULL, GENDERS_SHORT_TO_FULL, UNITS, API_URL } from '../../../common/constants'

interface PostPageState {
  isLoading: boolean,
  postData: PostData,
  error: string
}

const PostImage: React.SFC<any> = ({ data }) => {
  return (
    <img className='object-contain' src={data.image_url}></img>
  )
}

const PostInfo: React.SFC<any> = ({ data, units }) => {
  const {
    id,
    brand,
    article_name,
    article_gender,
    article_type,
    article_size,
    article_waist,
    article_inseam,
    height_m,
    weight_kg,
    gender,
    image_url,
    created_at
  } = data
  return (
    <div className='w-full flex flex-col items-start'>
      <div className='flex justify-between w-full'>
        <div className='text-xl font-mono'>{brand}</div>
        <div className=''>
          <span className='inline-block bg-gray-300 rounded-full px-2 text-gray-700 text-xs mr-1'>{CLOTHING_GENDERS_SHORT_TO_FULL[article_gender]}</span>
          <span className='inline-block bg-gray-300 rounded-full px-2 text-gray-700 text-xs'>{capFirst(article_type)}</span>
        </div>
      </div>
      <div className='mb-4 leading-tight'>
        <div className='flex items-center mb-2'>
          <h2 className='text-3xl inline-block mr-2 font-semibold'>{article_name}</h2>
        </div>
        <span className='inline-block font-mono rounded-full px-2 border border-gray-700 text-lg'>
          {buildSizingString(article_size, article_waist, article_inseam, true)}
        </span>
      </div>
      <div className='mb-2 border rounded py-2 pl-3 pr-5'>
        <div className='flex items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" className='inline fill-current h-4 w-4 mr-1' viewBox='25 50 512 512'>
            <path d="M256 48c22 0 40 18 40 40s-18 40-40 40-40-18-40-40 18-40 40-40zm192 144.1H320V464h-42.7V320h-42.7v144H192V192.1H64v-42.7h384v42.7z"/>
          </svg>
          <h2 className='inline-block text-lg font-semibold mb-1'>Body Information</h2>
        </div>
        <div className='flex'>
          <div className='mr-8'>
            <div className='text-gray-600 text-sm'>Height</div>
            {
              units === UNITS.METRIC ?
              <span className='font-mono text-lg'>{metresToFeetString(height_m)}</span> :
              <span className='font-mono text-lg'>{metresToCmString(height_m)}</span>
            }
          </div>
          <div>
            <div className='text-gray-600 text-sm'>Weight</div>
            {
              units === UNITS.METRIC ?
              <span className='font-mono text-lg'>{kgsToLbsString(weight_kg)}</span> :
              <span className='font-mono text-lg'>{kgsToKgsString(weight_kg)}</span>
            }
          </div>
        </div>
        <div>
          <div className='text-gray-600 text-sm'>Gender</div>
          <span className='font-mono text-lg'>{GENDERS_SHORT_TO_FULL[gender]}</span>
        </div>
      </div>
    </div>
  )
}

class PostPage extends React.Component<any, PostPageState> {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      postData: null,
      error: ''
    }
  }
 
  componentDidMount() {
    this.setState({ isLoading: true })
    const { id } = this.props.match.params
    const route = API_URL + '/api/posts/' + id
    axios.get(route)
      .then(res => {
        this.setState({
          postData: res.data.data,
          error: ''
        })
        console.log(res.data.data)
      }).catch(err => {
        this.setState({
          error: err.response ? err.response.data.message : 'Could not fetch post'
        })
      }).finally(() => {
        this.setState({ isLoading: false })
      })
  }

  render() {
    return (
      <section className='my-8 px-2'>
        <div className='mx-auto overflow-hidden flex flex-col md:flex-row md:h-580 max-w-4xl bg-white rounded'>
          <div className='w-full h-580 flex justify-center md:flex-col md:h-auto md:w-5/12 bg-black'>
            { this.state.postData && <PostImage data={this.state.postData} /> }
          </div>
          <div className='w-full p-3 md:w-7/12'>
            { !this.state.error && this.state.postData && <PostInfo data={this.state.postData} units={this.props.units} /> }
            { this.state.error && <h2>{this.state.error}</h2> }
          </div>
        </div>
      </section>
    )
  }
}

export default PostPage