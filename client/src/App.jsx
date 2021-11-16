import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Components
import { ButtonAppBar } from './components/common';
import { Classes, Login } from './components/pages/view';
import Message from './components/common/message/Message';

function App() {
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [message, setMessage] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const toggleMessage = (
    value = { isDisplayed: false, content: '', type: 'success' }
  ) => {
    setMessage(value);
  };

  const handleOpenNewClassDialog = (value = false) => {
    setIsDialogOpened(value);
  };

  return (
    <BrowserRouter>
      <div className="App">
        {/* AppBar */}
        <ButtonAppBar handleOpenNewClassDialog={handleOpenNewClassDialog} user={user} setUser={setUser}/>
        <Routes>
          {/* Login block */}
          <Route
            path="/login"
            element={user ? <Navigate to="/"/> : <Login toggleMessage={toggleMessage} setUser={setUser}/>}
          />
          {/* Class list block */}
          <Route
            path="/"
            element={
              <Classes
                isDialogOpened={isDialogOpened}
                handleOpenNewClassDialog={handleOpenNewClassDialog}
              />
            }
          />
        </Routes>
        <Message
          toggleMessage={toggleMessage}
          message={message}
          type={'success'}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
