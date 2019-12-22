import React from 'react'
import { PostCardProps } from './types'
import PostInfo from './PostInfo'
import { Link } from 'react-router-dom'

// TODO: probably don't have the images so large on large breakpoint
const RecentCard: React.SFC<PostCardProps> = ({ data }) => {
  const {
    id,
    image_url,
  } = data
  return (
    <div className='flex flex-row h-40 bg-white w-full p-3 sm:border sm:h-auto sm:rounded sm:flex-col'>
      <Link to={'/posts/' + id}>
        <img className='w-3/12 h-full rounded mr-3 sm:mr-0 sm:mb-2 sm:w-full sm:h-56 object-cover' src={image_url}></img>
      </Link>
      <div className='w-9/12 h-24 md:w-full'>
        <PostInfo data={data} />
      </div>
    </div>
  )
}

export default RecentCard