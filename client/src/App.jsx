import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Components
import { ButtonAppBar } from './components/common';
import { Classes, Login } from './components/pages/view';

function App() {
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  const handleOpenNewClassDialog = (value = false) => {
    setIsDialogOpened(value);
  };

  const user = false;

  return (
    <BrowserRouter>
      <div className="App">
        {/* AppBar */}
        <ButtonAppBar handleOpenNewClassDialog={handleOpenNewClassDialog} />
        <Routes>
          {/* Login block */}
          <Route path="/login" element={<Login user={user} />} />
          {/* Class list block */}
          <Route
            path="/classes"
            element={
              <Classes
                isDialogOpened={isDialogOpened}
                handleOpenNewClassDialog={handleOpenNewClassDialog}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
