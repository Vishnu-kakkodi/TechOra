import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Brush, Layout, Users } from 'lucide-react';
import HOMEPIC2 from '../../assets/frontEnd/Carosal2.jpg';
import HOMEPIC3 from '../../assets/frontEnd/Carosal3.jpg';

const Hero1 = () => {
  const services = [
    {
      title: 'Master Creative Branding and Strategic Design',
      icon: <Brush className="w-6 h-6 text-blue-600" />,
      image: HOMEPIC3,
      color: 'bg-orange-100',
      accent: 'border-l-orange-400 border-l-8'
    },
    {
      title: 'UX/UI Design & Website/App Design',
      icon: <Layout className="w-6 h-6 text-blue-600" />,
      features: [
        'Visual Hierarchy',
        'Color Theory',
        'Typography guideline',
        'Modern Design Trend',
        'Readability, Accessibili'
      ],
      color: 'bg-blue-50',
      accent: 'border-l-blue-400 border-l-8'
    },
    {
      title: 'Transform Customer Engagement with Proven Strategies',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      image: HOMEPIC2,
      color: 'bg-orange-100',
      accent: 'border-l-orange-400 border-l-8'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    hover: {
      rotate: 360,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
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
      <motion.div
        variants={itemVariants}
        className="mb-8 flex justify-between items-center"
      >
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-navy-900"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Professional And<br />
          Highly Qualified Tutors
        </motion.h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            className={`rounded-lg p-6 ${service.color} relative group min-h-[280px] ${service.accent} cursor-pointer`}
            whileHover={{
              scale: 1.02,
              y: -5,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
              transition: { duration: 0.3 }
            }}
          >
            <div className="flex flex-col h-full">
              {service.image && (
                <motion.div
                  className="mb-4 overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img
                    src={service.image}
                    alt={service.title}
                    className="rounded-lg w-full object-cover"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
              )}
              
              <motion.div
                className="mb-4"
                variants={iconVariants}
                whileHover="hover"
              >
                {service.icon}
              </motion.div>

              <motion.h3
                className="text-lg font-semibold text-navy-900 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {service.title}
              </motion.h3>

              {service.features && (
                <motion.ul
                  className="space-y-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  {service.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-center gap-2"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { 
                          opacity: 1, 
                          x: 0,
                          transition: {
                            duration: 0.3,
                            delay: idx * 0.1
                          }
                        }
                      }}
                      whileHover={{
                        x: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <motion.span
                        className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                        whileHover={{ scale: 1.5 }}
                      />
                      {feature}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Hero1;