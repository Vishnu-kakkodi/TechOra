

import HOMEPIC1 from '../../assets/frontEnd/HOMEPIC.png';
import HOMEPIC2 from '../../assets/frontEnd/Carosal2.jpg';
import HOMEPIC3 from '../../assets/frontEnd/Carosal3.jpg';
import { useState, useEffect } from 'react';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
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
    {
      image: HOMEPIC3,
      title: "Future-Proof Your Career",
      subtitle: "Invest in yourself",
      description: [
        "Affordable and flexible courses,",
        "starting at just ₹299."
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
    <div className="relative w-full min-h-[60vh] flex items-center overflow-hidden">
      {/* Image Section */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute w-full transition-transform duration-700 ${
            index === currentSlide ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <img
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className="w-full h-[60vh] object-cover"
          />
          <div className="absolute top-1/2 left-[10%] md:left-[200px] bg-white bg-opacity-90 transform -translate-y-1/2 text-black p-6 md:p-10 border-2 rounded-lg shadow-lg">
            <div className="text-xl md:text-3xl font-bold mb-2 text-center md:text-left">
              {slide.title}
            </div>
            <div className="text-lg md:text-2xl font-semibold mb-4 text-center md:text-left">
              {slide.subtitle}
            </div>
            <div className="text-sm md:text-base font-normal text-gray-700 text-center md:text-left">
              {slide.description.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
      >
        <ArrowBigLeft />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
      >
        <ArrowBigRight />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-black" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
