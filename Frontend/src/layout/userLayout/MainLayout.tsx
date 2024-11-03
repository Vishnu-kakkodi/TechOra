import React from 'react'
import Navbar from '../../components/header/Navbar'
import HomeLayout3 from './HomeLayout1'
import HomeLayout2 from './HomeLayout2'
import AboutLayout from './AboutLayout'
import Footer from '../../components/footer/Footer'

const MainLayout = () => {
  return (
    <div>
        <Navbar />
        <HomeLayout3 />
        <AboutLayout />
        <HomeLayout2 />
        <Footer />
    </div>
  )
}

export default MainLayout