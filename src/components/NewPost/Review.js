import React from 'react'
import { Input, Select, FormButton } from '../Form/'
import { CLOTHING_TYPES, HEIGHT_UNITS, WEIGHT_UNITS } from '../../../common/constants'

const Title = ({ title }) => {
  return <h3 className='text-sm uppercase font-mono text-gray-700'>{title}</h3>
}

const Info = ({ info }) => (
  <p className='mb-1 font-semibold'>{info}</p>
)

const Line = ({ title, info }) => {
  return (
    <>
      <Title title={title} />
      <Info info={info} />
    </>
  )
}

const Review = ({ onPrevClick, onPostClick, formValues }) => {
  const { clothing, body } = formValues
  return (
    <section className='p-3 h-full flex flex-col'>
      <h1 className='font-bold text-2xl mb-3'>Review</h1>
      <div className='flex flex-col justify-between flex-grow'>
        <div className='w-full'>
          <div className='mb-3'>
            <h2 className='font-bold text-lg mb-2'>Clothing</h2>
            <div className='flex flex-wrap mb-1'>
              <div className='mr-4'>
                <Line title='Brand' info={clothing.brand} />
              </div>
              <div>
                <Line title='Article Name' info={clothing.name} />
              </div>
            </div>
            <div className='flex flex-wrap mb-1'>
              <div className='mr-4'>
                <Line title='Gender' info={clothing.gender} />
              </div>
            </div>
            <div className='flex flex-wrap mb-1'>
              <div className='mr-4'>
                <Line title='Type' info={clothing.type} />
              </div>
              {
                clothing.type === CLOTHING_TYPES.PANTS || clothing.type === CLOTHING_TYPES.SHORTS ?
                <>
                <div className='mr-4'><Line title='Waist' info={clothing.waist} /></div>
                <div className='mr-4'><Line title='Inseam' info={clothing.inseam} /></div>
              </> :
              <div className='mr-4'><Line title='Size' info={clothing.size} /></div>
            }
            </div>
          </div>
          <div className='mb-3'>
            <h2 className='font-bold text-lg mb-2'>Body Information</h2>
            <div className='flex flex-wrap mb-1'>
              <div className='mr-4'>
                <Title title='Height' />
                {
                  body.heightUnits === HEIGHT_UNITS.FT_IN ?
                  <Info info={body.heightFeet + 'ft ' + body.heightInches + 'in'} /> :
                  <Info info={body.heightCm + 'cm'} />
                }
              </div>
              <div>
                <Line
                  title='Weight'
                  info={body.weightUnits === WEIGHT_UNITS.LBS ? (body.weightLbs + 'lbs') : (body.weightKgs + 'kgs')}
                />
              </div>
            </div>
            <div className='flex flex-wrap mb-1'>
              <div className='mr-4'>
                <Line title='Gender' info={body.gender} />
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-between'>
          <FormButton text='Body Information' direction='prev' onClick={onPrevClick} />
          <FormButton text='Post' onClick={onPostClick} />
        </div>
      </div>
    </section>
  )
}

export default Review
