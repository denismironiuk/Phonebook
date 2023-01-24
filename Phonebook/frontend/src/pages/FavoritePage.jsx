import React, { useContext } from 'react'
import FavoriteContacts from '../components/Contacts/favorite/FavoriteContacts'

import { ContactsContext } from '../store/contacts-context'
import { FavoriteContext } from '../store/favorite-context'

function FavoritePage() {
const contactCtx=useContext(ContactsContext)
const favoriteCtx=useContext(FavoriteContext)

const favorite=contactCtx.contacts.filter(contact=>favoriteCtx.ids.includes(contact._id))

  return (
    <FavoriteContacts items={favorite}/>
  )
}

export default FavoritePage