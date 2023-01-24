import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import { AuthContextProvider } from './store/auth-context';
import ContactsContextProvider from './store/contacts-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <ContactsContextProvider>
<BrowserRouter>
    <App />
  </BrowserRouter>
  </ContactsContextProvider>
  </AuthContextProvider>
  
);
