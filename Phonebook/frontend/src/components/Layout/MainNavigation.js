import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import { FavoriteContext } from '../../store/favorite-context';

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const authCtx=useContext(AuthContext)
  const favCtx=useContext(FavoriteContext)

  const isLoggedIn=authCtx.isLoggedIn

  const logoutHandler=()=>{
    authCtx.logout()
  }
  return (
    <header className={classes.header}>
      <div className={classes.navigation}>
      <Link to='/'>
        <div className={classes.logo}>Phonebook</div>
      </Link>
      <nav>
        <ul>
          <div className={classes.link}>
          {!isLoggedIn && <li>
            <Link to='/auth'></Link>
          </li> }
          {isLoggedIn && <li>
            <Link to='/favorite'>Favorite <span>({favCtx.ids.length})</span></Link>
          </li>}
          {isLoggedIn && <li>
            <Link to='/contacts'>Contacts</Link>
          </li>}
          {isLoggedIn && <li>
            <Link to='/profile'>Profile</Link>
          </li>}
          </div>
          <div>
          {isLoggedIn && <li className={classes.logout}>
            <button onClick={logoutHandler}>Logout</button>
          </li>}
          </div>
        </ul>
      </nav>
      </div>
    </header>
  );
};

export default MainNavigation;
