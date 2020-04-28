import React from 'react'
import { ACCEPTED_FILETYPES } from '../../../common/constants'

const getTransform = (rotation, clientWidth, clientHeight) => {
  let str = `rotate(${rotation * 90}deg)`

  if (rotation % 2 !== 0) {
    let offset = (clientHeight - clientWidth) / 2
    if (rotation === 3) offset = -offset
    str += ` translateX(${offset}px)`
  }

  return str
}

class ImageUpload extends React.PureComponent {
  constructor(props) {
    super(props)
    this.containerRef = React.createRef()
  }

  render() {
    const bgColor = this.props.imageUrl ? 'bg-black' : 'bg-gray-400'
    const { rotation } = this.props
    // NOTE: you MUST check for rotation % 2 !== 0 AND NOT pass in 1 or 3 on the first render since the refs will not be defined
    // and it'll crash lol
    const { current: containerElem } = this.containerRef
    return (
      <div
        ref={this.containerRef}
        className={'relative flex h-full justify-center overflow-hidden text-center ' + bgColor}>
        <img src={this.props.imageUrl} className='object-contain' style={{
          maxHeight: (rotation % 2 !== 0) ? containerElem.clientWidth : '100%',
          maxWidth: (rotation % 2 !== 0) ? containerElem.clientHeight : '100%',
          transform: (rotation > 0) ? getTransform(rotation, containerElem.clientWidth, containerElem.clientHeight) : null
        }}/>
        {
          this.props.error &&
          <div className='absolute self-start top-0 py-1 px-3 mt-3 text-sm text-white bg-red-600 rounded-full'>
            {this.props.error}
          </div>
        }
        {
          !this.props.imageUrl &&
          <div className='self-center'>
            <h1 className='mb-2 font-semibold text-gray-600'>Upload a picture of you wearing something.</h1>
            <label
              htmlFor='image-upload'
              className='inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded cursor-pointer'>
              <svg className='inline fill-current h-4 w-4 mr-2' xmlns='http://www.w3.org/2000/svg' viewBox='0 2 24 24'>
                <path d='M19.5 20.5h-15A2.47 2.47 0 0 1 2 18.07V5.93A2.47 2.47 0 0 1 4.5 3.5h4.6a1 1 0 0 1 .77.37l2.6 3.18h7A2.47 2.47 0 0 1 22 9.48v8.59a2.47 2.47 0 0 1-2.5 2.43z'></path>
              </svg>
              Browse files
            </label>
            <input
              id='image-upload'
              className='hidden'
              type='file'
              accept={ACCEPTED_FILETYPES}
              onChange={this.props.onFileChange} />
          </div>
        }
        {
          this.props.imageUrl &&
            <div className='absolute px-2 pb-2 flex w-full justify-between self-end'>
              <label
                htmlFor='image-upload'
                className='block bg-white hover:bg-gray-200 self-center px-3 font-semibold rounded-full cursor-pointer'>
                Replace image
              </label>
              <input
                id='image-upload'
                className='hidden'
                type='file'
                accept={ACCEPTED_FILETYPES}
                onChange={this.props.onFileChange} />
              <button
                className='block bg-white hover:bg-gray-200 px-1 rounded-full cursor-pointer'
                onClick={this.props.onRotateClick}>
                <svg className='inline fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 2 24 24'>
                  <path xmlns="http://www.w3.org/2000/svg" d="M20.3 13.43a1 1 0 0 0-1.25.65A7.14 7.14 0 0 1 12.18 19 7.1 7.1 0 0 1 5 12a7.1 7.1 0 0 1 7.18-7 7.26 7.26 0 0 1 4.65 1.67l-2.17-.36a1 1 0 0 0-1.15.83 1 1 0 0 0 .83 1.15l4.24.7h.17a1 1 0 0 0 .34-.06.33.33 0 0 0 .1-.06.78.78 0 0 0 .2-.11l.09-.11c0-.05.09-.09.13-.15s0-.1.05-.14a1.34 1.34 0 0 0 .07-.18l.75-4a1 1 0 0 0-2-.38l-.27 1.45A9.21 9.21 0 0 0 12.18 3 9.1 9.1 0 0 0 3 12a9.1 9.1 0 0 0 9.18 9A9.12 9.12 0 0 0 21 14.68a1 1 0 0 0-.7-1.25z"/>
                </svg>
              </button>
            </div>
        }
      </div>
    )
  }
}

export default ImageUpload
