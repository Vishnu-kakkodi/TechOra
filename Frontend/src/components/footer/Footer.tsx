import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

interface FooterProps {
  companyName?: string;
}

const Footer: React.FC<FooterProps> = ({ companyName = "TechOra" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-purple-100 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-purple-600 font-bold text-2xl">{companyName}</h2>
          </div>
          <p className="text-gray-600">Kochi, India</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <FontAwesomeIcon icon={faPhone} size="lg" />
              <span>123 456 7890</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FontAwesomeIcon icon={faEnvelope} size="lg" />
              <span>techora@gmail.com</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Follow Us</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-purple-600">
                <FontAwesomeIcon icon={faFacebookF} size="lg" />
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600">
                <FontAwesomeIcon icon={faYoutube} size="lg" />
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">About Us</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-purple-600">Careers</a></li>
            <li><a href="#" className="text-gray-600 hover:text-purple-600">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-600 hover:text-purple-600">Founders</a></li>
            <li><a href="#" className="text-gray-600 hover:text-purple-600">Help & Support</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Community</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-purple-600">Community Hub</a></li>
            <li><a href="#" className="text-gray-600 hover:text-purple-600">Events</a></li>
            <li><a href="#" className="text-gray-600 hover:text-purple-600">Blogs</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Submit Your Review</h3>
          <p className="text-gray-600">
            We value your feedback! Please leave your review below.
          </p>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
            />
            <textarea
              placeholder="Your Review"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
              rows={4}
            />
            <button className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-300">
              Submit Review
            </button>
          </div>
        </div>
        
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="text-center text-gray-600 text-sm">
          Copyright ©{currentYear} | {companyName} Template. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
