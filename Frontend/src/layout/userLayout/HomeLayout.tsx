import React from 'react'
import Navbar from '../../components/header/Navbar'
import HomeLayout3 from './HomeLayout3'
import HomeLayout2 from './HomeLayout2'
import AboutLayout from './AboutLayout'
import Footer from '../../components/footer/Footer'

const HomeLayout = () => {
  return (
    <div>
        {/* <Navbar /> */}
        <HomeLayout3 />
        <Footer />
    </div>
  )
}

export default HomeLayout