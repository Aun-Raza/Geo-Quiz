import * as React from 'react';
import { User } from '../interfaces/User';

interface NavBarProps {
  user: User | undefined;
}

function NavBar({ user }: NavBarProps) {
  return (
    <nav className='navbar bg-light'>
      <div className='container-fluid'>
        <span className='navbar-brand my-2'>Geo-Quiz</span>
        {user && <span className='navbar-text my-2'>{user.email}</span>}
      </div>
    </nav>
  );
}

export default NavBar;
