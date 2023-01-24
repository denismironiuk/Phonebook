import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';

const AuthForm = () => {

  const authCtx=useContext(AuthContext)
  const [isLogin, setIsLogin] = useState(true);
  const [errors,setErrors]=useState(Error())
  console.log(errors.message)
  

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const history=useHistory()

  const [authData,setAuthData]=useState({
    name:'',
    email:'',
    password:''
  })

  useEffect(()=>{
    setErrors({})
    
  },[authData])

  const changeHandlerInput=(e)=>{
    const {name,value}=e.target

     setAuthData({...authData,
      [name]: value,
    })

  }
  
  const submitHandler=(e)=>{
    e.preventDefault()

    if(isLogin){
      fetch('/auth/login',{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          email:authData.email,
          
          password:authData.password
        })
      }).then(res => {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
        
          throw  Error('Authenticated failed');
         
        }
        return res.json();
      }).then(resData => {
       
        authCtx.login(resData.token)
        setAuthData({
          email:'',
          password:'',
        
        })
        history.replace('/')
      })
      .catch(err => {
        setErrors(err)
       
      });

    }else{
      fetch('/auth/signup',{
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          email:authData.email,
          name:authData.name,
          password:authData.password
        })
      }).then(res => {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Creating a user failed!');
        }
        return res.json();
      }).then(resData => {
        console.log(resData);
        setAuthData({
          name:'',
          password:'',
          email:''
        })
         history.replace('/')
      })
      .catch(err => {
      setErrors(err)
       
      });
      
    }
  }

 

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <div className='error-container'> {errors && <p style={{color:"red"}}>{errors.message}</p>}</div>
      <form onSubmit={submitHandler}>
      {!isLogin && <div className={classes.control}>
          <label htmlFor='name'>Your Name</label>
          <input type='text' value={authData.name} id='text'name='name' required onChange={changeHandlerInput}/>
        </div>}
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' value={authData.email} id='email'name='email' required onChange={changeHandlerInput}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' value={authData.password} id='password' name='password' required onChange={changeHandlerInput}/>
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='submit'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
