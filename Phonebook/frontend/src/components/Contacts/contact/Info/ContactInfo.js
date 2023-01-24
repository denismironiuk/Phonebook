import React, { useEffect, useState } from "react";
import './ContactInfo.css'
const ContactInfo=({showInfoPopup,children,id})=>{
const[single,setSingle]=useState({})

useEffect(()=>{
fetch('http://localhost:8080/book/contact/'+id,{
    method: 'GET',
}).then(res=>{
    return res.json()
}).then(resData=>{
    console.log(resData)
    setSingle(resData.listContact)
}).catch(err=>{
    console.log(err)
})
},[])


    return(
        <section className="info-container">
            <div className="overlay">
            <div className="popup">
            <section style={{display:"flex",flexDirection:'column',alignItems:'flex-start'}}>
            
          {children}
          
        </section>
                <button onClick={showInfoPopup}>x</button>
            </div>
            
        </div>
        </section>
        
    )
}
export default ContactInfo;