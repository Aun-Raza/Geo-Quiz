import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className='border-2'>
      <ul className='flex gap-8 justify-center font-semibold'>
        <Link to='/' className='nav-item'>
          Home
        </Link>
        <Link to='/quizzes' className='nav-item'>
          Quizzes
        </Link>
        <Link to='/' className='nav-item'>
          About
        </Link>
        <Link to='/login' className='nav-item'>
          Login
        </Link>
      </ul>
    </nav>
  );
};

export default NavBar;
