import React, { useContext } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import { BsInfoCircle } from 'react-icons/bs';
import {MdOutlineFavoriteBorder,MdOutlineFavorite } from 'react-icons/md';
import './contact.css';
import { useState } from 'react';
import ContactInfo from './Info/ContactInfo';
import { Link } from 'react-router-dom';
import { FavoriteContext } from '../../../store/favorite-context';


const Contact = ({ val, deleteContact, editHandler }) => {
  const favCtx = useContext(FavoriteContext)
  const contactIsFavorite=favCtx.ids.includes(val._id)
  console.log(console.log(val))

  function changeFavoriteStatusHandler(){
    if(contactIsFavorite){
      favCtx.removeFavorite(val._id)
    }
    else{
      favCtx.addFavorite(val._id)
    }
  }
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const openPopup = () => {
    setShowInfoPopup(prev => !prev);
  };
  return (
    <div className='contact-container'>
      {showInfoPopup && (
        <ContactInfo showInfoPopup={openPopup} id={val._id}>
          <section style={{ display: "flex", flexDirection: 'column', alignItems: 'flex-start' }}>

            <h2>Name: {val.name}</h2>
            <h2>Phone: {val.phone}</h2>
            {val.email && <h2>Email: {val.email}</h2>}

          </section>
        </ContactInfo>
      )}
      <div className='favorite-container'>

        <i onClick={changeFavoriteStatusHandler} >{contactIsFavorite ?(<MdOutlineFavorite size={20} />):(<MdOutlineFavoriteBorder size={20} />)}</i></div>
      <figure className='image-container'>
        <img
          src={'https://picsum.photos/seed/picsum/200/300'}



          alt='none'
        />
      </figure>
      <section
        className='user-details'
        style={{ alignSelf: 'center' }}
      >
        <p style={{ fontSize: '1.5rem' }}>{val.name}</p>
      </section>

      <section style={{ alignSelf: 'center' }}>
        <i onClick={() => editHandler(val._id)}>
          <MdModeEdit size={15}  />
        </i>

        <i onClick={() => deleteContact(val._id)}>
          <FaRegTrashAlt size={15}  />
        </i>


        <i onClick={setShowInfoPopup}><BsInfoCircle size={15}  color='black' /></i>




      </section>
    </div>
  );
};

export default Contact;
