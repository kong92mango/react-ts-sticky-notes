import React from 'react';
import { NotesProvider } from './context/NotesContext';
import { Toolbar } from './components/Toolbar';
import { NoteCanvas } from './components/NoteCanvas';
import './App.css';

function App() {
  return (
    <NotesProvider>
      <div className="App">
        <Toolbar />
        <NoteCanvas />
      </div>
    </NotesProvider>
  );
}

export default App;