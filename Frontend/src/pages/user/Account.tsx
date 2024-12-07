import React from 'react'
import UserProfileSidebar from '../../components/sidebar/UserProfileSidebar'
import Navbar from '../../components/header/Navbar'
import { Outlet } from 'react-router-dom'

const Account = () => {
  return (
    <>
      <Navbar />
      <div className='flex'>
        <UserProfileSidebar />
        <Outlet />
      </div>
    </>
  )
}

export default Account