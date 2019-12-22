import React from 'react'
import { CLOTHING_GENDERS_SHORT_TO_FULL } from '../../../common/constants'
import { metresToFeetString, metresToCmString, kgsToLbsString } from '../../../common/util'
import { capFirst, buildSizingString } from '../../util'
import { PostCardProps } from './types'
import { Link } from 'react-router-dom'

const PostInfo: React.SFC<PostCardProps> = ({ data }) => {
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
    image_url,
    created_at
  } = data

  return (
    <div className='leading-tight text-gray-800'>
      <Link to={'/posts/' + id}>
        <div className='text-sm text-gray-600 font-mono'>{brand}</div>
        <div className='flex items-center mb-2'>
          <h2 className='truncate inline-block mr-2 text-gray-800 font-semibold'>{article_name}</h2>
          <span className='flex-shrink-0 inline-block font-mono rounded-full px-2 border border-gray-700 text-xs'>
            {buildSizingString(article_size, article_waist, article_inseam, false)}
          </span>
        </div>
      </Link>
      <div className='mb-2 text-sm font-mono'>
        <svg xmlns="http://www.w3.org/2000/svg" className='inline fill-current h-4 w-4 mr-1' viewBox='25 50 512 512'>
          <path d="M256 48c22 0 40 18 40 40s-18 40-40 40-40-18-40-40 18-40 40-40zm192 144.1H320V464h-42.7V320h-42.7v144H192V192.1H64v-42.7h384v42.7z"/>
        </svg>
        <span className=''>{metresToFeetString(height_m)}</span>
        <span className='mx-1'>|</span>
        <span className=''>{kgsToLbsString(weight_kg)}</span>
      </div>
      <div className='mb-1'>
        <span className='inline-block bg-gray-300 rounded-full px-2 text-gray-700 text-xs mr-1'>{CLOTHING_GENDERS_SHORT_TO_FULL[article_gender]}</span>
        <span className='inline-block bg-gray-300 rounded-full px-2 text-gray-700 text-xs'>{capFirst(article_type)}</span>
      </div>
    </div>
  )
}

export default PostInfo