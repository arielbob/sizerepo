import React from 'react'
import ImageUpload from './ImageUpload'
import ClothingDetails from './ClothingDetails'
import BodyInfo from './BodyInfo'
import Review from './Review'
import { Formik } from 'formik'
import axios from 'axios'
import {
  CLOTHING_GENDERS,
  CLOTHING_TYPES,
  CLOTHING_SIZES,
  GENDERS,
  HEIGHT_UNITS,
  WEIGHT_UNITS,
  API_URL
} from '../../../common/constants'

const PAGES = {
  CLOTHING: 'clothing',
  BODY: 'body',
  REVIEW: 'review'
}
const PAGES_ORDER = [PAGES.CLOTHING, PAGES.BODY, PAGES.REVIEW]

interface NewPostProps {
  history: any;
}

class NewPost extends React.Component<NewPostProps, any> {
  constructor(props) {
    super(props)
    this.state = {
      currentPageIndex: 0,
      image: {
        file: null,
        url: '',
        error: '',
        rotation: 0 // rotation * 90 = rotation degree clockwise
      },
      formValues: {
        clothing: {
          name: '',
          brand: '',
          gender: CLOTHING_GENDERS.MENS,
          type: CLOTHING_TYPES.SHIRT,
          size: CLOTHING_SIZES.M,
          waist: '',
          inseam: ''
        },
        body: {
          heightUnits: HEIGHT_UNITS.FT_IN,
          heightFeet: '',
          heightInches: '',
          heightCm: '',
          weightUnits: WEIGHT_UNITS.LBS,
          weightLbs: '',
          weightKgs: '',
          gender: GENDERS.MALE
        }
      }
    }
  }

  componentDidMount() {
    console.log('remounting')
  }

  nextPage(values = null) {
    const { currentPageIndex } = this.state
    const newPageIndex = Math.min(currentPageIndex + 1, PAGES_ORDER.length - 1)
    this.setState({ currentPageIndex: newPageIndex })
    this.setState({
      currentPageIndex: newPageIndex,
      formValues: {
        ...this.state.formValues,
        ...values
      }
    })
  }

  prevPage(values = null) {
    const { currentPageIndex } = this.state
    const newPageIndex = (currentPageIndex - 1 >= 0) ? (currentPageIndex - 1) : 0
    this.setState({
      currentPageIndex: newPageIndex,
      formValues: {
        ...this.state.formValues,
        ...values
      }
    })
  }

  handleFileChange(file) {
    URL.revokeObjectURL(this.state.image.url)
    if (file) {
      this.setState({
        image: {
          ...this.state.image,
          file,
          rotation: 0,
          url: URL.createObjectURL(file),
          error: null
        }
      })
    }
  }

  handleRotateClick() {
    this.setState({
      image: {
        ...this.state.image,
        rotation: (this.state.image.rotation + 1) % 4
      }
    })
  }

  handlePost() {
    console.log('posting...')

    if (!this.state.image.file) {
      return this.setState({
        image: {
          ...this.state.image,
          rotation: 0,
          error: 'Please upload an image'
        }
      })
    }

    const fd = new FormData()

    fd.append('image', this.state.image.file)
    fd.append('imageRotation', this.state.image.rotation)
    fd.append('clothing', JSON.stringify(this.state.formValues.clothing))
    fd.append('body', JSON.stringify(this.state.formValues.body))

    const route = API_URL + '/api/posts/submit'

    this.setState({
      isLoading: true,
      error: ''
    })

    axios.post(route, fd).then(res => {
      this.setState({
        isLoading: false,
        image: {
          ...this.state.image,
          error: ''
        }
      })
      this.props.history.push('/posts/' + res.data.data.id)
    }).catch(err => {
      this.setState({
        isLoading: false,
        image: {
          ...this.state.image,
          error: err.response ? err.response.data.message : 'Could not create post'
        }
      })
    })
  }

  // TODO: the anonymous functions should be declared elsewhere so that they don't
  // get recreated on every render and we don't have to re-render components that use them
  render() {
    const currentPage = PAGES_ORDER[this.state.currentPageIndex]
    const hasNext = this.state.currentPageIndex < PAGES_ORDER.length - 1

    return (
      <section className='my-8 px-2'>
        <div className='mx-auto bg-white rounded flex flex-col overflow-hidden md:h-580 max-w-4xl md:flex-row'>
          <div className='w-full h-580 md:w-5/12 md:h-auto'>
            <ImageUpload
              imageUrl={this.state.image.url}
              error={this.state.image.error}
              rotation={this.state.image.rotation}
              onRotateClick={() => this.handleRotateClick()}
              onFileChange={(e) => this.handleFileChange(e.target.files[0])}/>
          </div>
          <div className='w-full md:w-7/12'>
            {
              currentPage === PAGES.CLOTHING ?
              <ClothingDetails
                formValues={this.state.formValues.clothing}
                onNextClick={(values) => this.nextPage({ clothing: values })}
              /> : null
            }
            {
              currentPage === PAGES.BODY ?
              <BodyInfo
                formValues={this.state.formValues.body}
                onPrevClick={(values) => this.prevPage({ body: values })}
                onNextClick={(values) => this.nextPage({ body: values })}
              /> : null}
            {
              currentPage === PAGES.REVIEW ?
              <Review
                onPrevClick={() => this.prevPage()}
                onPostClick={() => this.handlePost()}
                isLoading={this.state.isLoading}
                formValues={this.state.formValues}
              /> : null
            }
          </div>
        </div>
      </section>
    )
  }
}

export default NewPost
