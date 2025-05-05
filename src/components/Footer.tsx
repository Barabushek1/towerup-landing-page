import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
const Footer: React.FC = () => {
  const {
    t
  } = useLanguage();
  const currentYear = new Date().getFullYear();
  return <footer className="text-gray-400 bg-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <img src="/lovable-uploads/5b8a353d-ebd6-43fe-8f54-7bacba7095ff.png" alt="TOWER UP" className="h-14 w-auto" />
            <p className="text-sm max-w-xs font-benzin">
              {t('footer.companyDesc')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-[#161616] hover:bg-primary transition-colors rounded-full p-2" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="bg-[#161616] hover:bg-primary transition-colors rounded-full p-2" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="bg-[#161616] hover:bg-primary transition-colors rounded-full p-2" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-medium text-lg mb-6 font-benzin">{t('footer.navigation')}</h3>
            <ul className="space-y-4">
              <li>
                <a href="/about" className="hover:text-primary transition-colors font-benzin">
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <a href="/projects" className="hover:text-primary transition-colors font-benzin">
                  {t('nav.projects')}
                </a>
              </li>
              <li>
                <a href="/news" className="hover:text-primary transition-colors font-benzin">
                  {t('nav.news')}
                </a>
              </li>
              <li>
                <a href="/vacancies" className="hover:text-primary transition-colors font-benzin">
                  {t('nav.vacancies')}
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-primary transition-colors font-benzin">
                  {t('nav.contacts')}
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-medium text-lg mb-6 font-benzin">{t('footer.services')}</h3>
            <ul className="space-y-4">
              <li>
                <a href="/design" className="hover:text-primary transition-colors font-benzin">
                  {t('nav.design')}
                </a>
              </li>
              <li>
                <a href="/construction" className="hover:text-primary transition-colors font-benzin">
                  {t('nav.construction')}
                </a>
              </li>
              <li>
                <a href="/solutions" className="hover:text-primary transition-colors font-benzin">
                  {t('nav.solutions')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-medium text-lg mb-6 font-benzin">{t('footer.contacts')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <span className="font-benzin">{t('footer.address')}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <span className="font-benzin">+998 55 510 00 03</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <span className="font-benzin">info@towerup.uz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            &copy; {currentYear} {t('footer.companyName')}. {t('footer.rights')}
          </p>
          <a href="/privacy-policy" className="text-sm hover:text-primary transition-colors">
            {t('footer.policy')}
          </a>
        </div>
      </div>
    </footer>;
};
export default Footer;