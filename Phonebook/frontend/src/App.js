import { Switch, Route, Redirect } from 'react-router-dom';
import AuthContext from './store/auth-context';
import MainNavigation from './components/Layout/MainNavigation';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import { useContext } from 'react';
import FavoriteContextProvider from './store/favorite-context';
import FavoritePage from './pages/FavoritePage';
import ContactList from './components/Contacts/contactList/ContactList';
import './App.css'


function App() {
  const authCtx=useContext(AuthContext)
  const isLoggedIn=authCtx.isLoggedIn
  return (
    <div className='App'>
    <FavoriteContextProvider>
    <MainNavigation/>
      <Switch>
        <Route path='/' exact>
        {isLoggedIn && <Redirect to={'/contacts'} />}
          {!isLoggedIn && <Redirect to={'/auth'}/>}
          
        </Route>
        {!isLoggedIn &&  <Route path='/auth'>
          <AuthPage />
        </Route>}
       {isLoggedIn && <>
        <Route path={'/contacts'}><ContactList/></Route>
        <Route path='/favorite'>
          <FavoritePage/>
        </Route>
        <Route path='/profile'>
          <UserProfile />
        </Route>
       </>
       }
       <Route path='*'>
        <Redirect to={'/'}/>

       </Route>
       
      </Switch>
      </FavoriteContextProvider>
    </div>
  );
}

export default App;
