import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState } from 'react';
import './App.css';
import { ButtonAppBar } from './components/common';
import { Classes } from './components/pages/view';


function App() {
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  const handleOpenNewClassDialog = (value = false) => {
    setIsDialogOpened(value);
  }

  return (
    <div className="App">
      {/* AppBar */}
      <ButtonAppBar handleOpenNewClassDialog={handleOpenNewClassDialog}/>

      {/* Class list block */}
      <Classes isDialogOpened={isDialogOpened} handleOpenNewClassDialog={handleOpenNewClassDialog}/>
    </div>
  );
}

export default App;
