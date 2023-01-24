import React, { useContext } from 'react'

import {MdOutlineFavoriteBorder,MdOutlineFavorite } from 'react-icons/md';
import { FavoriteContext } from '../../../store/favorite-context';
import '../contact/contact.css';


function Singlefavorite({val}) {
    const favCtx=useContext(FavoriteContext)
  return (
    <div className='contact-container'>
          <div className='favorite-container'>

<i onClick={()=>favCtx.removeFavorite(val._id)}  ><MdOutlineFavorite size={20} /></i></div>
      
    
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
      

    
    </div>

  )
}

export default Singlefavorite