import React from 'react'
import landingPageIMG from '../../assets/frontEnd/landingPageIMG.png'
import coursePic from '../../assets/frontEnd/coursePic.jpg'

const HomeLayout2 = () => {
  return (
    <div>
      <hr className='boarder-t boareder-grey-300' />
      <main className="container bg ml-2container">
        <div className='flex items-center'>
          <div className='w-1/2 m-8'>
            <img src={coursePic}
              alt="Best course image"
              className="mt-8 mb-8 ml-8 h-[300px] w-[500px] transition-opacity duration-500" />
          </div>
          <div className="w-1/2 ml-[100px] text-wrapper mr-[120px]">
          <p className="text-[30px] font-bold text-left text-black mt-[10px] mb-6 font-jakarta capitalize">
        Why Choose TechOra?
        </p>
            <p className="text-[14px] text-justify text-left text-black mb-6 font-jakarta capitalize">

              With a legacy of over two decades, TechOra stands as a premier educational platform, offering a comprehensive range of courses tailored to meet the evolving demands of learners worldwide. Founded in 2004, TechOra has steadily grown to feature more than 4,000 courses across a wide array of disciplines, from technology and science to arts, business, and more. These courses are meticulously crafted in collaboration with renowned institutions, ensuring a curriculum that is both industry-relevant and academically enriching.

              What truly sets TechOra apart is its network of highly educated and experienced faculty. Our instructors are top-tier professionals, many of whom have years of teaching and industry experience, bringing both theoretical expertise and practical insights into the learning process. This ensures that every course not only covers the essential concepts but also provides real-world applications, giving students the edge they need to excel in their careers or academic pursuits.
            </p>

          </div>
        </div>

        <div className='flex items-center'>
          <div className="w-1/2 ml-[100px] text-wrapper mr-[120px]">
          <p className="text-[30px] font-bold text-left text-black mt-[10px] mb-6 font-jakarta capitalize">
        Why Choose TechOra?
        </p>
            <p className="text-[14px] text-justify text-left text-black mb-6 font-jakarta capitalize">

              With a legacy of over two decades, TechOra stands as a premier educational platform, offering a comprehensive range of courses tailored to meet the evolving demands of learners worldwide. Founded in 2004, TechOra has steadily grown to feature more than 4,000 courses across a wide array of disciplines, from technology and science to arts, business, and more. These courses are meticulously crafted in collaboration with renowned institutions, ensuring a curriculum that is both industry-relevant and academically enriching.

              What truly sets TechOra apart is its network of highly educated and experienced faculty. Our instructors are top-tier professionals, many of whom have years of teaching and industry experience, bringing both theoretical expertise and practical insights into the learning process. This ensures that every course not only covers the essential concepts but also provides real-world applications, giving students the edge they need to excel in their careers or academic pursuits.
            </p>

          </div>
          <div className='w-1/2 m-8'>
            <img src={coursePic}
              alt="Best course image"
              className="mt-8 mb-8 ml-8 h-[300px] w-[500px] transition-opacity duration-500" />
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomeLayout2