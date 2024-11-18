import React, { useState, useEffect } from 'react';
import landingPageIMG from '../../assets/frontEnd/landingPageIMG.png';
import coursePic from '../../assets/frontEnd/coursePic.jpg';
import About from '../../assets/frontEnd/About.png';

const AboutLayout = () => {
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
    <div className="bg-gray-200">
      <main className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
            <img 
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className="mt-8 mb-8 h-[200px] md:h-[300px] w-full md:w-[500px] object-cover transition-opacity duration-500 rounded-lg shadow-md"
            />
          </div>
          <div className="w-full md:w-1/2 text-wrapper md:ml-8">
            <h2 className="text-2xl md:text-[30px] font-bold text-left text-black mb-6 font-jakarta capitalize">
              About
            </h2>
            <div className="text-sm md:text-[14px] text-justify text-black mb-6 font-jakarta">
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