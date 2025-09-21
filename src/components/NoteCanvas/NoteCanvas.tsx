import React, { useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useNotes } from '../../context/NotesContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { Note } from '../Note';
import { TrashZone } from '../TrashZone';
import { Position } from '../../types';
import { clampPosition, isInDeleteZone } from '../../utils/positioning';
import styles from './noteCanvas.module.css';

export const NoteCanvas: React.FC = () => {
  const { state, startDrag, updateDrag, endDrag, deleteNote, updateNote } = useNotes();
  const [dragPosition, setDragPosition] = useState<Position>({ x: 0, y: 0 });

  const { isDragging, isResizing, draggedNoteId, handleMouseDown, handleTouchStart, handleResizeStart } = useDragAndDrop({
    onDragStart: (noteId, startPosition, offset) => {
      startDrag(noteId, 'move', startPosition, offset);
      setDragPosition(startPosition);
      document.body.classList.add('dragging');
    },
    onDragMove: (position) => {
      updateDrag(position);
      setDragPosition(position);
    },
    onDragEnd: (position) => {
      endDrag();
      setDragPosition({ x: 0, y: 0 });
      document.body.classList.remove('dragging');
    },
    onDrop: (noteId, position) => {
      const shouldDelete = isInDeleteZone(position);
      
      if (shouldDelete) {
        deleteNote(noteId);
      } else {
        // Ensure note is clamped to canvas bounds
        const draggedNote = state.notes.find(n => n.id === noteId);
        if (draggedNote) {
          const canvasSize = {
            width: window.innerWidth,
            height: window.innerHeight - 80
          };
          
          const clampedPosition = clampPosition(
            { x: draggedNote.x, y: draggedNote.y },
            draggedNote.size,
            canvasSize
          );

          // Only update if position changed after clamping
          if (clampedPosition.x !== draggedNote.x || clampedPosition.y !== draggedNote.y) {
            updateNote(noteId, clampedPosition);
          }
        }
      }
    },
    onResizeStart: (noteId, startPosition, startSize) => {
      document.body.classList.add('dragging');
    },
    onResizeMove: (noteId, newSize) => {
      updateNote(noteId, { size: newSize });
    },
    onResizeEnd: (noteId, finalSize) => {
      updateNote(noteId, { size: finalSize });
      document.body.classList.remove('dragging');
    }
  });

  const handleNoteMouseDown = (event: React.MouseEvent, noteId: string) => {
    const note = state.notes.find(n => n.id === noteId);
    if (note) {
      handleMouseDown(event, noteId, { x: note.x, y: note.y });
    }
  };

  const handleNoteTouchStart = (event: React.TouchEvent, noteId: string) => {
    const note = state.notes.find(n => n.id === noteId);
    if (note) {
      handleTouchStart(event, noteId, { x: note.x, y: note.y });
    }
  };

  const handleNoteResizeStart = (event: React.MouseEvent, noteId: string) => {
    const note = state.notes.find(n => n.id === noteId);
    if (note) {
      handleResizeStart(event, noteId, note.size);
    }
  };

  return (
    <div className={styles.canvas}>
      {state.notes.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <DocumentTextIcon style={{ width: '64px', height: '64px', color: '#B8860B', opacity: 0.8 }} />
          </div>
          <h2>No sticky notes yet</h2>
          <p>Click "Add Note" to create your first sticky note!</p>
          <p className={styles.hint}>
            <strong>Tip:</strong> Drag the header to move notes, drag the bottom-right corner to resize, or drag to the bottom to delete!
          </p>
        </div>
      ) : (
        <div className={styles.notesContainer}>
          {state.notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              isDragging={(isDragging || isResizing) && draggedNoteId === note.id}
              onMouseDown={handleNoteMouseDown}
              onTouchStart={handleNoteTouchStart}
              onResizeStart={handleNoteResizeStart}
            />
          ))}
        </div>
      )}
      
      <TrashZone
        dragPosition={dragPosition}
        isDragging={isDragging}
        draggedNoteId={draggedNoteId}
      />
    </div>
  );
};