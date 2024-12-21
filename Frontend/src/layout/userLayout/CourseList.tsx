'use client'

import { motion } from 'framer-motion'
import { Star, Clock, Users } from 'lucide-react'

const courses = [
  {
    id: 1,
    title: 'Complete Python Bootcamp',
    instructor: 'John Doe',
    rating: 4.8,
    students: 10234,
    duration: '6 weeks',
    image: '/placeholder.svg?height=200&width=300&text=Python'
  },
  {
    id: 2,
    title: 'Web Development Masterclass',
    instructor: 'Jane Smith',
    rating: 4.9,
    students: 8765,
    duration: '8 weeks',
    image: '/placeholder.svg?height=200&width=300&text=Web+Dev'
  },
  {
    id: 3,
    title: 'Data Science Fundamentals',
    instructor: 'Alex Johnson',
    rating: 4.7,
    students: 6543,
    duration: '10 weeks',
    image: '/placeholder.svg?height=200&width=300&text=Data+Science'
  },
  {
    id: 4,
    title: 'Machine Learning A-Z',
    instructor: 'Emily Brown',
    rating: 4.9,
    students: 7890,
    duration: '12 weeks',
    image: '/placeholder.svg?height=200&width=300&text=ML'
  }
]

export default function CourseList() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Find The Right Online Course For You</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from a wide range of online courses taught by expert instructors
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">Instructor: {course.instructor}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="font-semibold">{course.rating}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-1" />
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                <button className="w-full bg-emerald-500 text-white py-2 rounded-full hover:bg-emerald-600 transition-colors">
                  Enroll Now
                </button>
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
          <button className="bg-white text-emerald-500 border-2 border-emerald-500 px-8 py-3 rounded-full hover:bg-emerald-50 transition-colors">
            Explore All Courses
          </button>
        </motion.div>
      </div>
    </section>
  )
}