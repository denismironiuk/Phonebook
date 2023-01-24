import { createContext, useState } from "react";

export const FavoriteContext=createContext({
    ids:[],
    addFavorite:(id)=>{},
    removeFavorite:(id)=>{}
})

function FavoriteContextProvider({children}){
 const[favoriteContacts,setFavoriteContacts]  =useState([])

 function addFavorite(id){
    setFavoriteContacts(currentFavId=>[...currentFavId,id])
 }

 function removeFavorite(id){
    setFavoriteContacts(currentFavId=>currentFavId.filter(contactId=>contactId!==id))
 }

 const value={
    ids:favoriteContacts,
    addFavorite:addFavorite,
    removeFavorite:removeFavorite
 }

    return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>
}

export default FavoriteContextProvider;