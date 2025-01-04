
import { useState, useEffect } from 'react';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';
import HOMEPIC1 from '../../assets/frontEnd/HOMEPIC.png';
import HOMEPIC2 from '../../assets/frontEnd/Carosal2.jpg';
import HOMEPIC3 from '../../assets/frontEnd/Carosal3.jpg';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: HOMEPIC3,
      title: "Future-Proof Your Career",
      subtitle: "Invest in yourself",
      description: [
        "Affordable and flexible courses,",
        "starting at just ₹299."
      ],
    },
    {
      image: HOMEPIC1,
      title: "Learn, practice, succeed",
      subtitle: "(and save)",
      description: [
        "Courses for every step of your learning journey,",
        "starting at ₹499. Sale ends December 31."
      ],
    },
    {
      image: HOMEPIC2,
      title: "Achieve Your Goals",
      subtitle: "With expert-led courses",
      description: [
        "Upskill with the latest trends in technology,",
        "business, and more."
      ],
    },
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-[40vh] md:min-h-[60vh] flex items-center overflow-hidden">
      {/* Image Section */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-transform duration-700 ${
            index === currentSlide ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <img
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Text Content - Only visible on md and larger screens */}
          <div className="hidden md:block absolute top-1/2 left-[200px] 
                        bg-white bg-opacity-90 
                        transform -translate-y-1/2 
                        p-10 rounded-lg shadow-lg">
            <div className="text-3xl font-bold mb-2 text-left">
              {slide.title}
            </div>
            <div className="text-2xl font-semibold mb-4 text-left">
              {slide.subtitle}
            </div>
            <div className="text-base font-normal text-gray-700 text-left">
              {slide.description.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      {/* <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 
                   bg-black bg-opacity-50 hover:bg-opacity-70 
                   text-white p-2 rounded-full 
                   transition-all duration-200"
      >
        <ArrowBigLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 
                   bg-black bg-opacity-50 hover:bg-opacity-70 
                   text-white p-2 rounded-full 
                   transition-all duration-200"
      >
        <ArrowBigRight className="w-6 h-6" />
      </button> */}

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 
                       ${index === currentSlide 
                         ? "bg-white md:bg-black" 
                         : "bg-gray-400"
                       }`}
          />
        ))}
      </div>
    </div>
  );
}