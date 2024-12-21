'use client'

import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

export default function ExpertSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">
              Explore Expert Discover <br />
              Instructors From Around <br />
              The Globe
            </h2>
            <p className="text-gray-600 mb-8">
              Connect with expert instructors who bring real-world experience and knowledge to every lesson.
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`/placeholder.svg?height=40&width=40&text=${i}`}
                    alt={`Instructor ${i}`}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <div>
                <p className="font-semibold">12+ Expert Tutors</p>
                <p className="text-sm text-gray-600">Join the community</p>
              </div>
            </div>
            <button className="bg-emerald-500 text-white px-8 py-3 rounded-full hover:bg-emerald-600 transition-colors">
              Become an Instructor
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="Expert instructors"
              className="rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

