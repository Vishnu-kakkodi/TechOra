import React from 'react'
import landingPageIMG from '../../assets/frontEnd/landingPageIMG.png'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'

const HomeLayout1 = () => {
  const navigate = useNavigate();
  const props = useSpring({ 
    to: { opacity: 1, transform: 'translateY(0px)' }, 
    from: { opacity: 0, transform: 'translateY(-50px)' }, 
    config: { duration: 1000 } 
  });

  return (
    <div>
      <hr className='border-t border-grey-300' />
      <main className="container mx-auto">
        <div className='bg-custom-gradient flex flex-col md:flex-row items-center min-h-screen'>
          <div className="w-full md:w-1/2 md:ml-[130px] text-center md:text-left px-4 py-8">
            <p className="text-sm md:text-[14px] font-bold text-white mb-2 font-jakarta uppercase tracking-widest">
              Build Your Future
            </p>
            <h1 className="text-3xl md:text-[45px] font-bold text-white mb-2 font-jakarta capitalize">
              Let's Build Skills
            </h1>
            <p className="text-3xl md:text-[45px] font-bold text-white mb-2 font-jakarta">
              WITH <span className="text-yellow-500">techOra</span> & LEARN
            </p>
            <p className="text-3xl md:text-[45px] font-bold text-white mb-2 font-jakarta capitalize">
              without limits
            </p>
            <p className="text-sm md:text-[14px] font-bold text-white mb-6 font-jakarta capitalize">
              Take your learning organization to the next level.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-4 mb-2'>
              <button 
                onClick={() => navigate('/institute/login')}
                className='bg-yellow-500 text-black text-center rounded-[5px] p-3 w-full sm:w-auto'
              >
                Login as Institution
              </button>
              <ArrowRight className="text-white w-9 h-9 hidden sm:block" />
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end mt-8 md:mt-0">
            <img 
              src={landingPageIMG} 
              alt="Description of the image" 
              className="max-w-full md:max-w-[957px] h-auto object-contain"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomeLayout1