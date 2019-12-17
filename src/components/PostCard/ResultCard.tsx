import React from "react"
import { PostCardProps } from "./types"
import PostInfo from "./PostInfo"

const ResultCard: React.SFC<PostCardProps> = ({ data }) => {
  const {
    image_url,
  } = data
  return (
    <div className='flex flex-row h-40 bg-white w-full p-3 sm:border sm:h-auto sm:rounded sm:flex-col'>
      <img className='w-3/12 h-full rounded mr-3 sm:mr-0 sm:mb-2 sm:w-full sm:h-56 object-cover' src={image_url}></img>
      <div className='w-9/12 h-24 sm:w-full'>
        <PostInfo data={data} />
      </div>
    </div>
  )
}

export default ResultCard