import React from 'react'
import landingPageIMG from '../../assets/frontEnd/landingPageIMG.png'
import coursePic from '../../assets/frontEnd/coursePic.jpg'
import {
  ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HomeLayout1 = () => {

  const navigate = useNavigate();

  return (
    <div>
      <hr className='boarder-t boareder-grey-300' />
      <main className="container bg ml-2container">
        <div className='bg-custom-gradient flex items-center h-[100vh]'>
          <div className="w-1/2 ml-[130px] mb-[120px]">
            <p className="text-[14px] font-bold text-left text-white mb-2 font-jakarta capitalize tracking-widest">
              Build Your Future
            </p>
            <h1 className="text-[45px] font-bold text-left text-white mb-2 font-jakarta capitalize">
              Let's Build Skills
            </h1>
            <p className="text-[45px] font-bold text-left text-white mb-2 font-jakarta">
              WITH <span className="text-yellow-500">techOra</span> & LEARN
            </p>
            <p className="text-[45px] font-bold text-left text-white mb-2 font-jakarta capitalize">
              without limits
            </p>
            <p className="text-[14px] font-bold text-left text-white mb-6 font-jakarta capitalize">
              Take your learning organization to the next level.
            </p>
            <div className='flex justify-start space-y-2 mb-2 hover:cursor-pointer'>
              <a
                onClick={() => navigate('/institute/login')}
                className='bg-yellow-500 text-black text-center rounded-[5px] p-3'
              >
                Login as Institution
              </a>

              <ArrowRight className="text-white w-9 h-9" />
            </div>
          </div>

          <div className="flex items-end justify-end w-full h-[585px]">
            <img src={landingPageIMG} alt="Description of the image" className="w-[957px] h-auto" />
          </div>

        </div>
      </main>
    </div>
  )
}

export default HomeLayout1