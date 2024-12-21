'use client'

import { motion } from 'framer-motion'

const stats = [
  { number: '10K+', label: 'Students Enrolled' },
  { number: '75+', label: 'Expert Instructors' },
  { number: '63+', label: 'Professional Courses' },
  { number: '14+', label: 'Years Experience' },
]

export default function Stats() {
  return (
    <section className="bg-emerald-500 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-emerald-100">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

