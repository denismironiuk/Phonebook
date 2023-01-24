import React from 'react'
import Contact from '../contact/Contact'
import Singlefavorite from './Singlefavorite'

function FavoriteContacts({items}) {
    console.log(items)
  return (
    <div style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
        {!items.length ? (<p>You don't have favorites people yet</p>):(
            items.map(item=>{
                return <Singlefavorite
                key={item._id}
                val={item}
                />
            })
        )}
    </div>
  )
}

export default FavoriteContacts