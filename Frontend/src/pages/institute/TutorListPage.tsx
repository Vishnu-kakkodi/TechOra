import React from 'react'
import InstituteSidebar from '../../components/sidebar/InstituteSidebar'
import TutorList from '../../layout/institutionLaout/TutorList'

const TutorListPage = () => {
  return (
    <div className='flex'>
        <InstituteSidebar/>
        <TutorList/>
    </div>
  )
}

export default TutorListPage