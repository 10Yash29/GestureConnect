import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/register-face', label: 'Register Face' },
    { path: '/collect-gesture', label: 'Collect Gesture' },
    { path: '/train-model', label: 'Train Model' },
    { path: '/live-demo', label: 'Live Demo' }
  ];
  
  const isActive = (path) => {
    return location === path;
  };
  
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <span className={`material-icons ${styles.logoIcon}`}>face</span>
            <span className={styles.logoText}>Gesture Recognition</span>
          </div>
          
          <div className={styles.desktopLinks}>
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <a 
                  className={`${styles.navLink} ${isActive(link.path) ? styles.active : ''}`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
          
          <button 
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label="Mobile menu"
          >
            <span className="material-icons">menu</span>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuLinks}>
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <a 
                className={`${styles.mobileLink} ${isActive(link.path) ? styles.mobileActive : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
