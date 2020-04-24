import React from 'react'
import { PostCardProps } from './types'
import PostInfo from './PostInfo'
import { Link } from 'react-router-dom'

// TODO: probably don't have the images so large on large breakpoint
const RecentCard: React.SFC<PostCardProps> = ({ data, units }) => {
  const {
    id,
    image_url,
  } = data
  return (
    <div className='flex flex-row h-40 bg-white w-full p-3 md:border md:h-auto md:rounded md:flex-col'>
      <Link to={'/posts/' + id} className='overflow-hidden w-3/12 rounded mr-3 md:mr-0 md:mb-2 md:w-full md:h-56'>
        <img className='object-cover h-full w-full' src={image_url}></img>
      </Link>
      <div className='w-9/12 h-24 md:w-full'>
        <PostInfo data={data} units={units} />
      </div>
    </div>
  )
}

export default RecentCard