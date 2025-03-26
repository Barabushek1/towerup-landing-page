
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { name: 'Главная', path: '/' },
    { name: 'О нас', path: '/about' },
    { name: 'Проекты', path: '/projects' },
    { name: 'Решения', path: '/solutions' },
    { name: 'Новости', path: '/news' },
    { name: 'Контакты', path: '/contact' },
    { name: 'Админ', path: '/admin', isAdmin: true },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-opacity-80 backdrop-filter backdrop-blur-lg",
      scrolled ? "bg-neutral-900 py-3 shadow-lg" : "bg-transparent py-5"
    )}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-white font-bold text-xl font-benzin">
            TOWER UP
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.filter(item => !item.isAdmin).map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-benzin transition-colors hover:text-primary relative py-2",
                  location.pathname === item.path ? "text-white after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-primary" : "text-gray-300"
                )}
              >
                {item.name.toUpperCase()}
              </Link>
            ))}
            <div className="border-l border-gray-700 h-6"></div>
            <Link to="/admin" className="text-white text-sm font-benzin py-2 px-4 bg-gradient-to-r from-primary via-primary to-primary/80 rounded-lg transition-all hover:from-primary/90 hover:to-primary">
              АДМИН ПАНЕЛЬ
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu} 
            className="lg:hidden text-white focus:outline-none"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <nav className={cn(
        "fixed inset-0 bg-black bg-opacity-95 lg:hidden transition-all transform z-50 pt-20 px-6 overflow-y-auto",
        menuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={cn(
                "text-lg font-benzin py-3 px-4 rounded-lg transition-colors",
                location.pathname === item.path 
                  ? "bg-primary/10 text-white border-l-4 border-primary pl-3" 
                  : "text-gray-300 hover:bg-gray-800"
              )}
            >
              {item.name.toUpperCase()}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
