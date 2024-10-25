import React, { useState } from 'react';
import LandingPageHeader from '../components/header/landingPage';
import landingPageIMG from '../assets/frontEnd/landingPageIMG.png';
import coursePic from '../assets/frontEnd/coursePic.jpg';
import SignUpButton from '../components/buttons/SignUpButton';
import SignUpModal from '../components/modals/SignUpModal';
import LoginButton from '../components/buttons/loginButton';
import LoginModal from '../components/modals/loginModal';

const LandingPage = () => {
  const [isModalOpen,setModalOpen] = useState(false);
  const [isLoginModalOpen,setLoginModal] = useState(false)
  console.log(isModalOpen,"hai")
  
  return (
    <div className=" min-h-screen">
      <LandingPageHeader />
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
            <LoginButton handleSignUp = {()=>setLoginModal(true)} />
             
          </div>

          <div className="flex items-end justify-end w-full h-[585px]">
            <img src={landingPageIMG} alt="Description of the image" className="w-[957px] h-auto" />
          </div>

        </div>

        {isLoginModalOpen && (
        <div className="modal">
          <LoginModal setLoginModal={setLoginModal}/>
        </div>
      )}

        <div className='flex items-center'>
          <div className='w-1/2 m-8'>
            <img src={coursePic}
              alt="Best course image"
              className='w-full h-[400px] w-[550px]' />
          </div>
          <div className="w-1/2 ml-[100px] text-wrapper mr-[120px]">
          <p className="text-[30px] font-bold text-left text-black mt-[10px] mb-6 font-jakarta capitalize">
        Why Choose TechOra?
        </p>
            <p className="text-[14px] text-justify text-left text-black mb-6 font-jakarta capitalize">

              With a legacy of over two decades, TechOra stands as a premier educational platform, offering a comprehensive range of courses tailored to meet the evolving demands of learners worldwide. Founded in 2004, TechOra has steadily grown to feature more than 4,000 courses across a wide array of disciplines, from technology and science to arts, business, and more. These courses are meticulously crafted in collaboration with renowned institutions, ensuring a curriculum that is both industry-relevant and academically enriching.

              What truly sets TechOra apart is its network of highly educated and experienced faculty. Our instructors are top-tier professionals, many of whom have years of teaching and industry experience, bringing both theoretical expertise and practical insights into the learning process. This ensures that every course not only covers the essential concepts but also provides real-world applications, giving students the edge they need to excel in their careers or academic pursuits.
            </p>

          </div>
        </div>

        <div className='flex items-center'>
          <div className="w-1/2 ml-[100px] text-wrapper mr-[120px]">
          <p className="text-[30px] font-bold text-left text-black mt-[10px] mb-6 font-jakarta capitalize">
        Why Choose TechOra?
        </p>
            <p className="text-[14px] text-justify text-left text-black mb-6 font-jakarta capitalize">

              With a legacy of over two decades, TechOra stands as a premier educational platform, offering a comprehensive range of courses tailored to meet the evolving demands of learners worldwide. Founded in 2004, TechOra has steadily grown to feature more than 4,000 courses across a wide array of disciplines, from technology and science to arts, business, and more. These courses are meticulously crafted in collaboration with renowned institutions, ensuring a curriculum that is both industry-relevant and academically enriching.

              What truly sets TechOra apart is its network of highly educated and experienced faculty. Our instructors are top-tier professionals, many of whom have years of teaching and industry experience, bringing both theoretical expertise and practical insights into the learning process. This ensures that every course not only covers the essential concepts but also provides real-world applications, giving students the edge they need to excel in their careers or academic pursuits.
            </p>

          </div>
          <div className='w-1/2 m-8'>
            <img src={coursePic}
              alt="Best course image"
              className='w-full h-[400px] w-[550px]' />
          </div>
        </div>

        <div className='flex items-center'>
          <div className='w-1/2 m-8'>
            <img src={coursePic}
              alt="Best course image"
              className='w-full h-[400px] w-[550px]' />
          </div>
          <div className="w-1/2 ml-[100px] text-wrapper mr-[120px]">
          <p className="text-[30px] font-bold text-left text-black mt-[10px] mb-6 font-jakarta capitalize">
        Why Choose TechOra?
        </p>
            <p className="text-[14px] text-justify text-left text-black mb-6 font-jakarta capitalize">

              With a legacy of over two decades, TechOra stands as a premier educational platform, offering a comprehensive range of courses tailored to meet the evolving demands of learners worldwide. Founded in 2004, TechOra has steadily grown to feature more than 4,000 courses across a wide array of disciplines, from technology and science to arts, business, and more. These courses are meticulously crafted in collaboration with renowned institutions, ensuring a curriculum that is both industry-relevant and academically enriching.

              What truly sets TechOra apart is its network of highly educated and experienced faculty. Our instructors are top-tier professionals, many of whom have years of teaching and industry experience, bringing both theoretical expertise and practical insights into the learning process. This ensures that every course not only covers the essential concepts but also provides real-world applications, giving students the edge they need to excel in their careers or academic pursuits.
            </p>

          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
