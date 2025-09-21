export interface Note {
  id: string;
  title: string;
  x: number;
  y: number;
  size: number;
  content: string;
  color: string;
  zIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Position {
  x: number;
  y: number;
}

// Removed unused Size interface - only used in 2 places, can be inlined

// Simplified - only support bottom-right resize
export type ResizeHandle = 'se';

export interface DragState {
  isDragging: boolean;
  isResizing: boolean;
  dragType: 'move' | 'resize' | null;
  activeNoteId: string | null;
  startPosition: Position;
  offset: Position;
}

export interface NotesState {
  notes: Note[];
  dragState: DragState;
  selectedNoteId: string | null;
  nextZIndex: number;
  noteCounter: number;
}

export type NotesAction =
  | { type: 'CREATE_NOTE'; payload: { position: Position; size?: number; color?: string } }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: { id: string } }
  | { type: 'SELECT_NOTE'; payload: { id: string | null } }
  | { type: 'BRING_TO_FRONT'; payload: { id: string } }
  | { type: 'START_DRAG'; payload: { noteId: string; dragType: 'move' | 'resize'; startPosition: Position; offset: Position } }
  | { type: 'UPDATE_DRAG'; payload: { position: Position } }
  | { type: 'END_DRAG' }
  | { type: 'LOAD_NOTES'; payload: { notes: Note[]; noteCounter?: number } }
  | { type: 'CLEAR_ALL_NOTES' };

export interface StorageData {
  notes: Note[];
  noteCounter: number;
  lastModified: Date;
  version: string;
}