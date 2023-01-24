import { useContext, useState } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const authCtx = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const handleInputPassword = (e) => {
    setPassword(e.target.value);
    console.log(e.target.value);
  };
  const handlerUpdatePassword = (e) => {
    e.preventDefault();
    if (!password || password.trim().length === '') {
      console.log('empty');
      return;
    }
    fetch('http://localhost:8080/auth/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authCtx.token,
      },
      body: JSON.stringify({
        password: password
      }),
    });
  };
  return (
    <form onSubmit={handlerUpdatePassword} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input
          type='password'
          id='new-password'
          name='password'
          value={password}
          onChange={handleInputPassword}
        />
      </div>
      <div className={classes.action}>
        <button type='submit'>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
