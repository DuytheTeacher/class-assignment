import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Components
import { ButtonAppBar } from './components/common';
import { ClassDetail, Classes, Login, Register } from './components/pages/view';
import Message from './components/common/message/Message';
import TokenService from './services/token.service';

function App() {
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [message, setMessage] = useState(false);
  const [user, setUser] = useState(TokenService.getUser());
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
        <ButtonAppBar
          handleOpenNewClassDialog={handleOpenNewClassDialog}
          user={user}
          setUser={setUser}
        />
        <Routes>
          {/* Login block */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Login toggleMessage={toggleMessage} setUser={setUser} />
              )
            }
          />
          {/* Register block */}
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Register toggleMessage={toggleMessage} setUser={setUser} />
              )
            }
          />
          {/* Class list block */}
          <Route
            path="/"
            element={
              user ? (
                <Classes
                  isDialogOpened={isDialogOpened}
                  handleOpenNewClassDialog={handleOpenNewClassDialog}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* Class detail block */}
          <Route
            path="/class/:id"
            element={user ? <ClassDetail /> : <Navigate to="/login" />}
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
