import React from 'react'
import InstituteSidebar from '../../components/sidebar/InstituteSidebar'
import TutorList from '../../layout/institutionLaout/TutorList'
import InstituteFooter from '../../components/footer/InstituteFooter'

const TutorListPage = () => {
  return (
    <div className='flex'>
        <InstituteSidebar/>
        <div className='w-full'>
        <TutorList/>
        <InstituteFooter/>
        </div>
    </div>
  )
}

export default TutorListPage