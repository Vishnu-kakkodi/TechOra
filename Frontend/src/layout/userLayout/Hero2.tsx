import React from 'react';
import { motion } from 'framer-motion';
import Yvette from '../../assets/frontEnd/Yvette Switzer.webp';
import James from '../../assets/frontEnd/James Newman.webp';
import Shallamar from '../../assets/frontEnd/Shallamar Goodwin-Richards.webp';

const Hero2 = () => {
  const testimonials = [
    {
      name: 'Yvette Switzer',
      role: '4th Grade Teacher',
      image: Yvette,
      quote: 'I use Quizizz to reinforce and check understanding after we\'ve covered a concept pretty thoroughly. I use it in stations, I use it for tutoring. I also use it to review and prepare my students for benchmark and state tests.',
      highlight: 'They love it every time.',
      borderColor: 'border-rose-400',
      bgColor: 'bg-rose-50'
    },
    {
      name: 'James Newman',
      role: 'Sr. Manager of Academic Instructional Technology',
      image: James,
      quote: 'Quizizz motivates [students], increases confidence, and can help to establish a culture of learning and growing from mistakes.',
      highlight: '',
      borderColor: 'border-emerald-400',
      bgColor: 'bg-emerald-50'
    },
    {
      name: 'Shallamar Goodwin-Richards',
      role: 'High School Math Teacher',
      image: Shallamar,
      quote: 'I have students with IEPs, I am able to find lessons catering to their abilities and accommodations while being able to assign the other students with more rigorous assessments.',
      highlight: 'I am able to find lessons catering to their abilities and accommodations',
      borderColor: 'border-yellow-400',
      bgColor: 'bg-yellow-50'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { 
      scale: 0.8,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    
    <motion.div 
      className="max-w-6xl mx-auto p-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
            <p className="text-xl text-black-300 text-[30px] font-[700] mb-7 text-center">
              Best Blogs About Us
            </p>      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className={`rounded-lg p-6 ${testimonial.bgColor} border-2 ${testimonial.borderColor} relative h-full cursor-pointer`}
          >
            <div className="flex items-start space-x-4 mb-4">
              <motion.img
                variants={imageVariants}
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </motion.div>
            </div>
            
            <motion.div 
              className="text-gray-700 text-sm leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {testimonial.quote.split(testimonial.highlight).map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <motion.span
                      className="text-yellow-600 font-medium"
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {testimonial.highlight}
                    </motion.span>
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Hero2;