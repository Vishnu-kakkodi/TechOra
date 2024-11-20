import React from 'react'
import landingPageIMG from '../../assets/frontEnd/landingPageIMG.png'
import coursePic from '../../assets/frontEnd/coursePic.jpg'

const HomeLayout2 = () => {
  return (
    <div>
      <hr className='border-t border-grey-300' />
      <main className="container mx-auto px-4">
        <div className='flex flex-col md:flex-row items-center mb-12'>
          <div className='w-full md:w-1/2 flex justify-center mb-6 md:mb-0'>
            <img 
              src={coursePic}
              alt="Best course image"
              className="mt-8 h-[200px] md:h-[300px] w-full md:w-[500px] object-cover rounded-lg shadow-md transition-opacity duration-500" 
            />
          </div>
          <div className="w-full md:w-1/2 md:ml-8 text-wrapper">
            <h2 className="text-2xl md:text-[30px] font-bold text-left text-black mb-6 font-jakarta capitalize">
              Why Choose TechOra?
            </h2>
            <p className="text-sm md:text-[14px] text-justify text-black mb-6 font-jakarta">
              With a legacy of over two decades, TechOra stands as a premier educational platform, offering a comprehensive range of courses tailored to meet the evolving demands of learners worldwide. Founded in 2004, TechOra has steadily grown to feature more than 4,000 courses across a wide array of disciplines, from technology and science to arts, business, and more. These courses are meticulously crafted in collaboration with renowned institutions, ensuring a curriculum that is both industry-relevant and academically enriching.

              What truly sets TechOra apart is its network of highly educated and experienced faculty. Our instructors are top-tier professionals, many of whom have years of teaching and industry experience, bringing both theoretical expertise and practical insights into the learning process. This ensures that every course not only covers the essential concepts but also provides real-world applications, giving students the edge they need to excel in their careers or academic pursuits.
            </p>
          </div>
        </div>

        <div className='flex flex-col-reverse md:flex-row items-center'>
          <div className="w-full md:w-1/2 md:mr-8 text-wrapper">
            <h2 className="text-2xl md:text-[30px] font-bold text-left text-black mb-6 font-jakarta capitalize">
              Why Choose TechOra?
            </h2>
            <p className="text-sm md:text-[14px] text-justify text-black mb-6 font-jakarta">
              With a legacy of over two decades, TechOra stands as a premier educational platform, offering a comprehensive range of courses tailored to meet the evolving demands of learners worldwide. Founded in 2004, TechOra has steadily grown to feature more than 4,000 courses across a wide array of disciplines, from technology and science to arts, business, and more. These courses are meticulously crafted in collaboration with renowned institutions, ensuring a curriculum that is both industry-relevant and academically enriching.

              What truly sets TechOra apart is its network of highly educated and experienced faculty. Our instructors are top-tier professionals, many of whom have years of teaching and industry experience, bringing both theoretical expertise and practical insights into the learning process. This ensures that every course not only covers the essential concepts but also provides real-world applications, giving students the edge they need to excel in their careers or academic pursuits.
            </p>
          </div>
          <div className='w-full md:w-1/2 flex justify-center mb-6 md:mb-0'>
            <img 
              src={coursePic}
              alt="Best course image"
              className="h-[200px] md:h-[300px] w-full md:w-[500px] object-cover rounded-lg shadow-md transition-opacity duration-500" 
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomeLayout2