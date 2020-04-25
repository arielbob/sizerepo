import React from "react"
import { PostCardProps } from "./types"
import PostInfo from "./PostInfo"
import { Link } from 'react-router-dom'

const ResultCard: React.SFC<PostCardProps> = ({ data, units }) => {
  const {
    id,
    image_url,
  } = data
  return (
    <div className='flex flex-row bg-white w-full p-3 sm:rounded sm:flex-col h-40 sm:h-full'>
      <Link to={'/posts/' + id} className='overflow-hidden w-3/12 rounded mr-3 sm:mr-0 sm:mb-2 sm:w-full sm:h-56'>
        <img className='object-cover h-full w-full' src={image_url}></img>
      </Link>
      <div className='w-9/12 sm:w-full'>
        <PostInfo data={data} units={units} />
      </div>
    </div>
  )
}

export default ResultCard