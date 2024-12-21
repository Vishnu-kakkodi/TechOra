'use client'

import { motion } from 'framer-motion'
import { Code, Palette, BarChart, Camera, PenTool, Megaphone } from 'lucide-react'

const categories = [
  { icon: Code, title: 'UI/UX Design', count: '23 Courses' },
  { icon: Palette, title: 'Development', count: '45 Courses' },
  { icon: BarChart, title: 'Data Science', count: '32 Courses' },
  { icon: Camera, title: 'Photography', count: '15 Courses' },
  { icon: PenTool, title: 'Art & Design', count: '27 Courses' },
  { icon: Megaphone, title: 'Marketing', count: '18 Courses' },
]

export default function PopularCourses() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Explore Popular Courses</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from hundreds of courses from specialist organizations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <category.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{category.title}</h3>
                  <p className="text-gray-600 text-sm">{category.count}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button className="bg-emerald-500 text-white px-8 py-3 rounded-full hover:bg-emerald-600 transition-colors">
            Explore All Courses
          </button>
        </motion.div>
      </div>
    </section>
  )
}

