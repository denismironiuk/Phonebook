import { createContext, useReducer } from "react";


export const ContactsContext = createContext({
  contacts: [],
  setContacts:(contacts)=>{},
  addContacts: ({ name, phone, email, image }) => {},
  deleteContacts: (id) => {},
  updateContacts: (id, { name, phone, email, image }) => {},
});

function contactsReducer(state, action) {
  switch (action.type) {
    case "ADD":
        return [...state,{...action.payload}]

    case 'SET':
        return  action.payload

    case "UPDATE":
        const updatableContactIdx=state.findIndex(contact=>contact.id===action.payload)
        const updatableContact=state[updatableContactIdx]
        const updatedContact={...updatableContact,...action.payload.data}
        const updatedContacts=[...state]
        updatedContacts[updatableContactIdx]=updatedContact
        return updatedContacts

        case "DELETE":

        return state.filter(contact=>contact.id !==action.payload)

    default:
      return state;
  }
}

function ContactsContextProvider({ children }) {
 const [contactsState,dispatch]=useReducer(contactsReducer,[]);

 function addContacts(contactsData){
    dispatch({type: 'ADD',payload:contactsData})
 }

 function setContacts(contacts){
    dispatch({type:'SET',payload:contacts})
 }

 function deleteContacts(id){
    
    dispatch({type: 'DELETE',payload:id})
 }

 function updateContacts(id,contactsData){
    dispatch({type: 'UPDATE',payload:{id:id,data:contactsData}})
 }

 const value={
    contacts:contactsState,
    addContacts:addContacts,
    setContacts:setContacts,
    deleteContacts:deleteContacts,
    updateContacts:updateContacts
 }

  return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>;
}

export default ContactsContextProvider;
