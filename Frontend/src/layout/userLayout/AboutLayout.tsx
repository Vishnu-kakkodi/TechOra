import React, { useState, useEffect } from 'react';
// Import your images - update these paths according to your project structure
import landingPageIMG from '../../assets/frontEnd/landingPageIMG.png';
import coursePic from '../../assets/frontEnd/coursePic.jpg';
import About from '../../assets/frontEnd/About.png';

const AboutLayout = () => {
  // Array of image objects to cycle through
  const images = [
    { src: About, alt: "About image" },
    { src: landingPageIMG, alt: "Landing page image" },
    { src: coursePic, alt: "Course image" }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);


    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <main className="container bg-gray-200 ml-2container">
        <div className="flex items-center">
          <div className="w-1/2 m-8">
            <img 
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className="mt-8 mb-8 ml-8 h-[300px] w-[500px] transition-opacity duration-500"
            />
          </div>
          <div className="w-1/2 ml-[10px] text-wrapper mr-[120px]">
            <p className="text-[30px] font-bold text-left text-black mt-[10px] mb-6 font-jakarta capitalize">
              About
            </p>
            <div className="text-[14px] text-justify text-left text-black mb-6 font-jakarta capitalize">
              <p className="mb-4">
                Super-learning encourages a mindset of continuous improvement and lifelong learning. The process is not just about short-term gains but establishing habits that support ongoing personal and professional development.
              </p>
              <p className="mb-4">
                Super-learning often involves engaging multiple senses in the learning process. This can include visual, auditory, and kinesthetic elements to create a more immersive and memorable learning experience.
              </p>
              <p>
                Visualization is a common component of super-learning. Learners are encouraged to create mental images or diagrams to help reinforce concepts and information, making it easier to recall later.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutLayout;