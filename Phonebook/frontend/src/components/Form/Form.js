import React, { useState,useRef } from 'react';
import {RiCloseFill} from 'react-icons/ri'
import './Form.css';

const Form = ({
  showForm,
  errors,
  handlerAddData,
  handleChange,
  values,
  nameIsValid,
  phoneIsValid,
  emailIsValid,
  handleImage,
  inputImage,
  modalChange
}) => {
 
 
  return (
    <div className='form-container'>
      <div style={{ display: showForm ? 'flex' : 'none' }} className='overlay'>
        <form onSubmit={handlerAddData} className='popup'>
          <h3>Contact</h3>
       
          <section>
            <label htmlFor=''>Name*: </label>
            <input
              type='text'
              name='name'
              placeholder='letters only up to 15 characters'
              pattern='[a-z A-Z]{3,25}'
              title='letters only up to 15 characters'
              maxLength='25'
            
              value={values.name}
              
              onChange={handleChange}
              
            />
            {nameIsValid && <p>{values.validateName}</p>}
            
            
          </section>
          <section>
            <label htmlFor=''>Phone*: </label>
            <input
              type='number'
              name='phone'
             
              placeholder='example: 054-1234567'
              title='example: 054-1234567'
         
              value={values.phone}
              onChange={handleChange}
              required
              
            />
            {phoneIsValid && <p>{values.validatePhone}</p>}
          </section>
          <section>
            <label htmlFor="">Email: </label>
            <input 
            type="text" 
            name='email' 
            value={values.email} 
            title='example: contact@gmail.com' 
            onChange={handleChange}
            />
            {emailIsValid && <p>{values.validateEmail}</p>}
          </section>
          <section>
            <label htmlFor=''>Image: </label>
            <input
              type='file'
              name='image'
              
   ref={inputImage}
              
              onChange={handleImage}
            />
          </section>
          <div onClick={modalChange} className='cancel-form'>
            <i><RiCloseFill/></i>
          </div>
          <button type='submit' className='add-form'>Confirm</button>
        <p>* All reqired fields must be filled.</p>
        </form>
      </div>
    </div>
  );
};
export default Form;
