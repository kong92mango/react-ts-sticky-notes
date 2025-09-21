import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Note, NotesState, NotesAction, Position } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/positioning';
import { DEFAULT_NOTE, Z_INDEX } from '../utils/constants';

const initialDragState = {
  isDragging: false,
  isResizing: false,
  dragType: null,
  activeNoteId: null,
  startPosition: { x: 0, y: 0 },
  offset: { x: 0, y: 0 }
};

const initialState: NotesState = {
  notes: [],
  dragState: initialDragState,
  selectedNoteId: null,
  nextZIndex: Z_INDEX.BASE,
  noteCounter: 1
};

const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'CREATE_NOTE': {
      const { position, size = DEFAULT_NOTE.size, color = DEFAULT_NOTE.color } = action.payload;
      const newNote: Note = {
        id: generateId(),
        title: `Sticky Note ${state.noteCounter}`,
        x: position.x,
        y: position.y,
        size,
        content: '',
        color,
        zIndex: state.nextZIndex,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return {
        ...state,
        notes: [...state.notes, newNote],
        nextZIndex: state.nextZIndex + Z_INDEX.INCREMENT,
        selectedNoteId: newNote.id,
        noteCounter: state.noteCounter + 1
      };
    }

    case 'UPDATE_NOTE': {
      const { id, updates } = action.payload;
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === id
            ? { ...note, ...updates, updatedAt: new Date() }
            : note
        )
      };
    }

    case 'DELETE_NOTE': {
      const { id } = action.payload;
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== id),
        selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId
      };
    }

    case 'SELECT_NOTE': {
      return {
        ...state,
        selectedNoteId: action.payload.id
      };
    }

    case 'BRING_TO_FRONT': {
      const { id } = action.payload;
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === id
            ? { ...note, zIndex: state.nextZIndex }
            : note
        ),
        nextZIndex: state.nextZIndex + Z_INDEX.INCREMENT
      };
    }

    case 'START_DRAG': {
      const { noteId, dragType, startPosition, offset } = action.payload;
      return {
        ...state,
        dragState: {
          isDragging: dragType === 'move',
          isResizing: dragType === 'resize',
          dragType,
          activeNoteId: noteId,
          startPosition,
          offset
        },
        selectedNoteId: noteId
      };
    }

    case 'UPDATE_DRAG': {
      if (!state.dragState.activeNoteId) return state;
      
      const { position } = action.payload;
      const note = state.notes.find(n => n.id === state.dragState.activeNoteId);
      if (!note) return state;

      if (state.dragState.dragType === 'move') {
        // Calculate new note position: mouse position minus offset to top-left corner
        const newPosition = {
          x: position.x - state.dragState.offset.x,
          y: position.y - state.dragState.offset.y
        };

        return {
          ...state,
          notes: state.notes.map(n =>
            n.id === state.dragState.activeNoteId
              ? { ...n, x: newPosition.x, y: newPosition.y, zIndex: Z_INDEX.DRAGGING }
              : n
          )
        };
      }

      return state;
    }

    case 'END_DRAG': {
      if (!state.dragState.activeNoteId) return state;
      
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === state.dragState.activeNoteId
            ? { ...note, zIndex: note.zIndex === Z_INDEX.DRAGGING ? state.nextZIndex : note.zIndex }
            : note
        ),
        dragState: initialDragState,
        nextZIndex: state.dragState.activeNoteId ? state.nextZIndex + Z_INDEX.INCREMENT : state.nextZIndex
      };
    }

    case 'LOAD_NOTES': {
      const { notes, noteCounter = 1 } = action.payload;
      const maxZIndex = notes.reduce((max, note) => Math.max(max, note.zIndex), Z_INDEX.BASE);
      
      // Calculate next counter based on existing note titles
      let maxCounter = noteCounter;
      notes.forEach(note => {
        const match = note.title?.match(/Sticky Note (\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num >= maxCounter) {
            maxCounter = num + 1;
          }
        }
      });
      
      return {
        ...state,
        notes,
        nextZIndex: maxZIndex + Z_INDEX.INCREMENT,
        noteCounter: maxCounter
      };
    }

    case 'CLEAR_ALL_NOTES': {
      return {
        ...initialState,
        noteCounter: 1
      };
    }

    default:
      return state;
  }
};

interface NotesContextValue {
  state: NotesState;
  dispatch: React.Dispatch<NotesAction>;
  createNote: (position: Position, size?: number, color?: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;
  bringToFront: (id: string) => void;
  startDrag: (noteId: string, dragType: 'move' | 'resize', startPosition: Position, offset: Position) => void;
  updateDrag: (position: Position) => void;
  endDrag: () => void;
  clearAllNotes: () => void;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export const useNotes = (): NotesContextValue => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const { saveNotes, loadNotes, clearStorage, isLoading } = useLocalStorage();

  useEffect(() => {
    if (!isLoading) {
      const { notes: savedNotes, noteCounter } = loadNotes();
      if (savedNotes.length > 0) {
        const notesWithTitles = savedNotes.map((note, index) => ({
          ...note,
          title: note.title || `Sticky Note ${index + 1}`
        }));
        dispatch({ type: 'LOAD_NOTES', payload: { notes: notesWithTitles, noteCounter } });
      }
    }
  }, [isLoading, loadNotes]);

  useEffect(() => {
    if (!isLoading && state.notes.length >= 0) {
      saveNotes(state.notes, state.noteCounter);
    }
  }, [state.notes, state.noteCounter, saveNotes, isLoading]);

  const createNote = (position: Position, size?: number, color?: string) => {
    dispatch({ type: 'CREATE_NOTE', payload: { position, size, color } });
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    dispatch({ type: 'UPDATE_NOTE', payload: { id, updates } });
  };

  const deleteNote = (id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: { id } });
  };

  const selectNote = (id: string | null) => {
    dispatch({ type: 'SELECT_NOTE', payload: { id } });
  };

  const bringToFront = (id: string) => {
    dispatch({ type: 'BRING_TO_FRONT', payload: { id } });
  };

  const startDrag = (noteId: string, dragType: 'move' | 'resize', startPosition: Position, offset: Position) => {
    dispatch({ type: 'START_DRAG', payload: { noteId, dragType, startPosition, offset } });
  };

  const updateDrag = (position: Position) => {
    dispatch({ type: 'UPDATE_DRAG', payload: { position } });
  };

  const endDrag = () => {
    dispatch({ type: 'END_DRAG' });
  };

  const clearAllNotes = () => {
    clearStorage();
    dispatch({ type: 'CLEAR_ALL_NOTES' });
  };

  const value: NotesContextValue = {
    state,
    dispatch,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    bringToFront,
    startDrag,
    updateDrag,
    endDrag,
    clearAllNotes
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};