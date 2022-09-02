import React from 'react';
import { Link } from 'react-router-dom';
import { NavBarProps } from '../types/types.user';

function NavBar({ user, setUser }: NavBarProps) {
  function logout() {
    const token = localStorage.getItem('token');
    if (!token) return;

    localStorage.removeItem('token');
    setUser(undefined);
  }

  return (
    <nav className='navbar navbar-expand-lg bg-light'>
      <div className='container-fluid'>
        <Link className='navbar-brand' to='/'>
          Geo-Quiz
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNavAltMarkup'
          aria-controls='navbarNavAltMarkup'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNavAltMarkup'>
          <div className='navbar-nav'>
            <Link className='nav-link' to='/'>
              Home
            </Link>
            <Link className='nav-link' to='/quizzes-table'>
              Quizzes
            </Link>
            {user ? (
              <Link to='/' onClick={logout} className='navbar-text'>
                {user?.email}
              </Link>
            ) : (
              <Link className='nav-link' to='/login'>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
