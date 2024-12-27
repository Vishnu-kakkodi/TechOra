import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight 
} from 'lucide-react';

interface FooterProps {
  companyName?: string;
}

const Footer: React.FC<FooterProps> = ({ companyName = "TechOra" }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Our Team', href: '#' },
      { label: 'Contact Us', href: '#' }
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Safety Center', href: '#' },
      { label: 'Community Guidelines', href: '#' },
      { label: 'FAQs', href: '#' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Accessibility', href: '#' }
    ]
  };

  return (
    <footer className="bg-gray-50 border-t w-full">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{companyName}</h2>
              <p className="mt-2 text-sm text-gray-600">
                Empowering learners worldwide with quality education and innovative learning solutions.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-5 w-5 shrink-0" />
                <span className="text-sm">123 Learning Street, Education City</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-5 w-5 shrink-0" />
                <span className="text-sm">+1 234 567 890</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-5 w-5 shrink-0" />
                <span className="text-sm">contact@techora.com</span>
              </div>
            </div>

            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-400 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-red-600 transition-colors" aria-label="Youtube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Company</h3>
                <ul className="mt-4 space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 flex items-center group">
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Support</h3>
                <ul className="mt-4 space-y-3">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 flex items-center group">
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h3>
                <ul className="mt-4 space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 flex items-center group">
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-500">
              © {currentYear} {companyName}. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="#" className="hover:text-gray-900">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;