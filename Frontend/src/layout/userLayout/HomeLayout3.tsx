import React from 'react'
import landingPageIMG from '../../assets/frontEnd/landingPageIMG.png'
import coursePic from '../../assets/frontEnd/coursePic.jpg'
import {
  ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HomeLayout3 = () => {

  const navigate = useNavigate();

  return (
    <div>
      <hr className='boarder-t boareder-grey-300' />
      <main className="container bg-custom-gradient ml-2container">
        <div className=' flex items-center h-[100vh]'>
          <div className="w-1/2 ml-[130px] mb-[120px]">
            <p className="text-[14px] font-bold text-left text-black mb-2 font-inter capitalize tracking-tight">
              Build Your Future
            </p>
            <h1 className="text-[45px] font-bold text-left text-black mb-2 font-inter capitalize tracking-tight">
              Let's Build Skills
            </h1>
            <p className="text-[45px] font-bold text-left text-black mb-2 font-jakarta">
              WITH <span className="text-yellow-500">techOra</span> & LEARN
            </p>
            <p className="text-[45px] font-bold text-left text-black mb-2 font-inter capitalize tracking-tight">
              without limits
            </p>
            <p className="text-[14px] font-bold text-left text-black mb-6 font-inter capitalize tracking-tight">
              Take your learning organization to the next level.
            </p>
          </div>

          <div className="flex items-end justify-end w-full h-[585px]">
            <img src={landingPageIMG} alt="Description of the image" className="w-[957px] h-auto" />
          </div>

        </div>
      </main>
    </div>
  )
}

export default HomeLayout3