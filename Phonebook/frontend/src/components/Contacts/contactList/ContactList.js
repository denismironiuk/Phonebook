import React, { useEffect, useState, useRef, useContext } from 'react';
import { IoIosPersonAdd } from 'react-icons/io';
import { BsTrash } from 'react-icons/bs';
import Contact from '../../Contacts/contact/Contact';
import Form from '../../Form/Form';
import AuthContext from '../../../store/auth-context';
import openSocket from 'socket.io-client';
import { fetchContacts, addContacts, updateContacts, deleteContact } from '../../../util/http'
import '../../Contacts/contactList/ContactList.css';
import LoadinSpinner from '../../loadingSpinner/LoadinSpinner';
import { ContactsContext } from '../../../store/contacts-context';


const ContactList = () => {
  const contactsCtx = useContext(ContactsContext)
  
  const authCtx = useContext(AuthContext);
  const [edit, setEdit] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const [inputSearch, setInputSearch] = useState('');
  const [image, setImage] = useState('');
  const inputImage = useRef();

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const [showModal, setShowModal] = useState(false);

  const [inputData, setInputData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const handleChangeModal = () => {
    setShowModal((prev) => !prev);
    setInputData({
      name: '',
      phone: '',
      email: '',
      image: '',
    });
    setEdit(false)
  };

  const handleInputData = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handLeInputSearch = (e) => {
    setInputSearch(e.target.value);
  };

  useEffect(() => {
   

    loadContactsData();
    const socket = openSocket('/');
    socket.on('posts', (data) => {
      if (data.action === 'create') {
        addPost(data.post);
      }
       else if (data.action === 'update') {

       updatePost(data.post);
       loadContactsData()
       }
       else if (data.action === 'delete') {
       loadContactsData();
      }

   

  })}, []);

  function addPost(post) {
   
    contactsCtx.addContacts(post)
  };

  const updatePost = (post) => {
    
    
    contactsCtx.updateContacts(post._id,post)

  }

  //Load Data From Server created by Node js
  const loadContactsData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchContacts(authCtx.token)

      contactsCtx.setContacts(data.data.listContacts)
      setIsLoading(false)
    }
    catch (error) {
      console.log(error)

    }
  }


  //Add input data to server

  const handlerSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', inputData.name);
    formData.append('email', inputData.email);
    formData.append('phone', inputData.phone);
    formData.append('image', image);

console.log(inputData)
    if (!edit) {
      try {
       const response= await addContacts(formData, authCtx.token)
       console.log(response)

       if(response.status===404)
       throw new Error(
        "Validation failed. Make sure the phone isn't used yet!"
      );

      } catch (err) {
     
        return
      }
    } else {
      try {
       const result= await updateContacts(formData, authCtx.token, inputData._id)
       console.log(result)
      }
      catch (err) {
        
        return
      }
    }
    setEdit(false)
    setShowModal(false);
    setInputData({
      name: '',
      phone: '',
      email: '',
      image: '',
    });

 
    loadContactsData();
  };

  const handleUpdateData = (id) => {
    const editContact = contactsCtx.contacts.find((el) => el._id === id);
console.log(editContact)
    setInputData(editContact);
    setImage(editContact.imageUrl);

    setEdit(true);
    setShowModal(true);
    
  };

  const handlerDeleteContact = async (id) => {
    
    try {
      await deleteContact(authCtx.token,id)
      contactsCtx.deleteContacts(id)
      loadContactsData()
    
    }
    catch (err) {

    }
  };

 

  if (loading) {
    return <LoadinSpinner />
  }

  return (
    <>
      <div className='phonebook'>
        <div className='phone-list'>
        <p>
          {contactsCtx.contacts && contactsCtx.contacts.length}
          {contactsCtx.contacts && contactsCtx.contacts.length <= 1 ? <> people</> : <> peoples</>}
        </p>
        <section className='first'>
          <input
            type='search'
            value={inputSearch}
            onChange={handLeInputSearch}
          />

          <section className='icons'>
            <i>
              <IoIosPersonAdd size={20} onClick={handleChangeModal} />
            </i>
            
          </section>
        </section>

        {contactsCtx.contacts ? (contactsCtx.contacts.filter((val) => val.name.toLowerCase().includes(inputSearch.toLowerCase()))
    .map((val) => (
      <Contact
        key={val._id}
        deleteContact={handlerDeleteContact}
        editHandler={handleUpdateData}
        val={val}
      />
    ))):(<p>You don't have contacts in your book yet!!! </p>)
  }
      </div>
      </div>
      <Form
      
        values={inputData}
        showForm={showModal}
        editHandler={handleUpdateData}
        handleChange={handleInputData}
        modalChange={handleChangeModal}
        inputImage={inputImage}
        handleImage={handleImage}
        handlerAddData={handlerSubmit}
      />
    </>
  );
};
export default ContactList;
