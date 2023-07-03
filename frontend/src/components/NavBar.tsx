import { Link, useNavigate } from 'react-router-dom';
import { NavBarProps } from '../types/type.user';

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
    <nav className='border-2 px-2 flex justify-between items-center'>
      <Link to='/'>
        <img src='/logo.png' className='nav-item' width={50} alt='' />
      </Link>
      <ul className='flex gap-8 justify-center font-semibold'>
        <Link to='/' className='nav-item'>
          Home
        </Link>
        <Link to='/quizzes' className='nav-item'>
          Quizzes
        </Link>
        <Link to='/about' className='nav-item'>
          About
        </Link>
        {!user ? (
          <Link to='/login' className='nav-item'>
            Login
          </Link>
        ) : (
          <p onClick={logout} className='nav-item'>
            Logout
          </p>
        )}
      </ul>
      {user ? (
        <button className='nav-item btn p-2 border-green-600 text-green-700'>
          <Link to={`/user-profile/${user?._id}`}>Add Quiz</Link>
        </button>
      ) : (
        <div></div>
      )}
    </nav>
  );
};

export default NavBar;
