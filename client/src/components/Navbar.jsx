import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import styles from '../styles/Navbar.module.css';
import { useAuth } from '../hooks/use-auth';

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Define base links that all users can see
  const baseLinks = [
    { path: '/', label: 'Home' },
    { path: '/live-demo', label: 'Live Demo' }
  ];
  
  // Admin-only links
  const adminLinks = [
    { path: '/register-face', label: 'Register Face' },
    { path: '/collect-gesture', label: 'Collect Gesture' },
    { path: '/train-model', label: 'Train Model' }
  ];
  
  // Combine links based on user role
  const navLinks = user && user.isAdmin
    ? [...baseLinks, ...adminLinks]
    : baseLinks;
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
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
              <Link key={link.path} href={link.path}
                className={`${styles.navLink} ${isActive(link.path) ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className={styles.authLinks}>
                <span className={styles.username}>
                  {user.username} {user.isAdmin && '(Admin)'}
                </span>
                <button 
                  onClick={handleLogout} 
                  className={`${styles.navLink} ${styles.logoutBtn}`}
                  disabled={logoutMutation.isPending}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/auth" 
                className={`${styles.navLink} ${isActive('/auth') ? styles.active : ''}`}
              >
                Login
              </Link>
            )}
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
            <Link 
              key={link.path} 
              href={link.path}
              className={`${styles.mobileLink} ${isActive(link.path) ? styles.mobileActive : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          {user ? (
            <>
              <div className={styles.mobileUsername}>
                {user.username} {user.isAdmin && '(Admin)'}
              </div>
              <button 
                onClick={handleLogout} 
                className={`${styles.mobileLink} ${styles.mobileLogoutBtn}`}
                disabled={logoutMutation.isPending}
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              href="/auth" 
              className={`${styles.mobileLink} ${isActive('/auth') ? styles.mobileActive : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
