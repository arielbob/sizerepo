import React from 'react'
import { Link } from 'react-router-dom'
import { BasicSelect } from '../Form'
import { UNITS } from '../../../common/constants'

interface NavbarProps {
  units: UNITS,
  onUnitsChange: any
}

const Navbar: React.SFC<NavbarProps> = ({ units, onUnitsChange }) => {
  return (
    <nav className='bg-white text-lg font-semibold p-3'>
      <ul className='container mx-auto flex justify-between items-center'>
        <div>
          <li className='mr-8'>
            <Link
              className='inline-block hover:bg-gray-200 py-1 px-4 rounded'
              to='/'>SizeRepo</Link>
          </li>
        </div>
        <div className='flex items-center'>
          <li className='mr-3'>
            <div className='relative'>
              <select
                className={'block appearance-none border px-3 py-1 pr-8 rounded leading-tight w-full'}
                value={units}
                onChange={(e) => {onUnitsChange(e.target.value)}}
              >
                {
                  Object.values(UNITS).map((unit, i) => <option key={i} value={unit}>{unit}</option>)
                }
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/></svg>
              </div>
            </div>
          </li>
          <li>
            <Link
              className='inline-block bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded sm:hidden'
              to='/post'>
              <svg className='inline fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='2 4 20 20'><path d='M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z'/></svg>
            </Link>
            <Link
              className='inline-block bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded hidden sm:block'
              to='/post'>
              <svg className='inline fill-current h-4 w-4 mr-1' xmlns='http://www.w3.org/2000/svg' viewBox='2 4 20 20'><path d='M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z'/></svg>
              Create Post
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  )
}

export default React.memo(Navbar)