
 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/admin'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                admin
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/create'
                className='nav-links'
                onClick={closeMobileMenu}
              >
               create
              </Link>
            </li>
           
            <li className='nav-item'>
              <Link
                to='/deleate'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                deleate
              </Link>
            </li>

            <li className='nav-item'>
              <Link
                to='/login'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                login
              </Link>
            </li>

            <li className='nav-item'>
              <Link
                to='/logout'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                logout
              </Link>
            </li>
            
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

  