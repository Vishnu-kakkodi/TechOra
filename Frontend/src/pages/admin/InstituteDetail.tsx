import React from 'react'
import InstitutionDetail from '../../layout/AdminLayout/InstitutionDetail'
import Sidebar from '../../components/sidebar/AdminSidebar'

const InstituteDetail = () => {
  return (
    <div className='flex'>
        <Sidebar />
        <InstitutionDetail />
    </div>
  )
}

export default InstituteDetail