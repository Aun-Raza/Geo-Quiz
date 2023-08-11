import { Link, useNavigate } from 'react-router-dom';
import { NavBarProps } from '../types/type.user';
import { Fragment } from 'react';

const NavBar = ({ user, setUser }: NavBarProps) => {
  const navigate = useNavigate();

  function logout() {
    const token = localStorage.getItem('token');
    if (!token) return;

    localStorage.removeItem('token');
    setUser(undefined);
    navigate('/quizzes');
  }

  return (
    <nav
      style={{ fontFamily: 'Fira Code, monospace' }}
      className='shadow-lg p-4 text-lg flex justify-between items-center'
    >
      <Link to='/' className='btn_np'>
        <img src='/assets/js_icon.svg' width={80} alt='' />
      </Link>
      <ul className='flex gap-8 justify-center font-semibold'>
        <Link
          to='/quizzes'
          className='btn nav-item  px-4 border-black rounded-lg'
        >
          View Quizzes
        </Link>

        {!user ? (
          <Link
            to='/login'
            className='btn nav-item  px-4 border-black rounded-lg'
          >
            Login
          </Link>
        ) : (
          <Fragment>
            <Link
              className='btn nav-item  px-4 border-black rounded-lg'
              to={`/user-profile/${user._id}`}
            >
              Profile
            </Link>
            <p
              onClick={logout}
              className='btn nav-item px-4 border-black rounded-lg'
            >
              Logout
            </p>
          </Fragment>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
