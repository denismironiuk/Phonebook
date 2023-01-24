import axios from 'axios'



export async function addContacts(contactData,authToken){
    const response=await axios.post('/book/contact',contactData,{
        headers: {
        Authorization: 'Bearer ' + authToken,
        "Content-Type": "multipart/form-data",
      },
    
    }
    
    )
    return response
}

export async function updateContacts(contactData,authToken,id){
    
    const response=await axios.put('/book/contact/'+id,contactData,{
        headers: {
        Authorization: 'Bearer ' + authToken,
        "Content-Type": "multipart/form-data",
      },
     
    }
    
    )
    return response
}

export async function deleteContact(authToken,id){
    
    const response=await axios.delete('/book/contact/'+id,{
        headers: {
        Authorization: 'Bearer ' + authToken,
       
      },
     
    }
    
    )
    return response
}


export async function fetchContacts(authToken){
   const response= await axios.get('/book/contacts', {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    })
    return response
}