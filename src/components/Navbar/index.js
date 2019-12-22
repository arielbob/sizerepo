import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='border-b bg-white text-lg font-semibold text-gray-800 p-3'>
      <ul className='flex justify-center'>
        <li className='mr-8'>
          <Link
            className='inline-block hover:bg-gray-200 py-1 px-4 rounded'
            to='/'>Browse</Link>
        </li>
        <li>
          <Link
            className='inline-block bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded'
            to='/post'>
            <svg className='inline fill-current h-4 w-4 mr-1' xmlns='http://www.w3.org/2000/svg' viewBox='5 5 20 20'><path d='M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z'/></svg>
            Create Post
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
