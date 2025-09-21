import React, { useState, useRef } from 'react';
import { Note as NoteType } from '../../types';
import { useNotes } from '../../context/NotesContext';
import { getResizeHandleAtPosition } from '../../utils/sizing';
import styles from './note.module.css';

interface NoteProps {
  note: NoteType;
  isDragging: boolean;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>, noteId: string) => void;
  onTouchStart: (event: React.TouchEvent<HTMLDivElement>, noteId: string) => void;
  onResizeStart?: (event: React.MouseEvent<HTMLDivElement>, noteId: string) => void;
}

export const Note: React.FC<NoteProps> = ({ 
  note, 
  isDragging, 
  onMouseDown, 
  onTouchStart,
  onResizeStart 
}) => {
  const { updateNote, selectNote, bringToFront, state } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [isHoveringResize, setIsHoveringResize] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isSelected = state.selectedNoteId === note.id;

  const handleContentChange = (value: string): void => {
    updateNote(note.id, { content: value });
  };

  const handleTextareaFocus = (): void => {
    setIsEditing(true);
    selectNote(note.id);
    bringToFront(note.id);
  };

  const handleTextareaBlur = (): void => {
    setIsEditing(false);
  };

  const handleNoteClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    // Don't select note if clicking on textarea
    if (event.target === textareaRef.current) {
      return;
    }
    
    selectNote(note.id);
    bringToFront(note.id);
  };

  const handleHeaderMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.preventDefault();
    onMouseDown(event, note.id);
  };

  const handleHeaderTouchStart = (event: React.TouchEvent<HTMLDivElement>): void => {
    event.preventDefault();
    onTouchStart(event, note.id);
  };

  const handleMouseDownOnNote = (event: React.MouseEvent<HTMLDivElement>): void => {
    // Check if clicking on the bottom-right resize area
    const rect = event.currentTarget.getBoundingClientRect();
    const relativePoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    const isOnResizeHandle = getResizeHandleAtPosition(
      relativePoint,
      { x: 0, y: 0 }, // Note position relative to itself is 0,0
      note.size
    );

    if (isOnResizeHandle && isSelected && onResizeStart) {
      event.preventDefault();
      event.stopPropagation();
      onResizeStart(event, note.id);
      return;
    }

    handleNoteClick(event);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (!isSelected) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const relativePoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    const isOnResizeHandle = getResizeHandleAtPosition(
      relativePoint,
      { x: 0, y: 0 },
      note.size
    );

    setIsHoveringResize(isOnResizeHandle);
  };

  const handleResizeHandleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    if (onResizeStart) {
      onResizeStart(event, note.id);
    }
  };

  const getCursor = (): string => {
    if (isDragging) return 'grabbing';
    if (isHoveringResize && isSelected) return 'se-resize';
    return 'default';
  };

  return (
    <div
      className={`
        ${styles.note} 
        ${isDragging ? styles.dragging : ''} 
        ${isSelected ? styles.selected : ''}
        ${isEditing ? styles.editing : ''}
      `}
      style={{
        position: 'absolute',
        left: note.x,
        top: note.y,
        width: note.size,
        height: note.size,
        backgroundColor: note.color,
        zIndex: note.zIndex,
        cursor: getCursor()
      }}
      onMouseDown={handleMouseDownOnNote}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHoveringResize(false)}
    >
      <div 
        className={styles.noteHeader}
        onMouseDown={handleHeaderMouseDown}
        onTouchStart={handleHeaderTouchStart}
      >
        <span className={styles.noteTitle}>{note.title}</span>
        
        <div className={styles.headerControls}>
          <span className={styles.sizeIndicator}>{note.size}px</span>
        </div>
      </div>
      
      <div className={styles.noteContent}>
        <textarea
          ref={textareaRef}
          className={styles.noteTextarea}
          value={note.content}
          onChange={(e) => handleContentChange(e.target.value)}
          onFocus={handleTextareaFocus}
          onBlur={handleTextareaBlur}
          placeholder="Type your note here..."
          style={{ 
            backgroundColor: 'transparent',
            cursor: isEditing ? 'text' : 'inherit'
          }}
        />
      </div>
      
      {/* Only show bottom-right resize handle when selected */}
      {isSelected && (
        <div className={styles.resizeHandles}>
          <div 
            className={`${styles.resizeHandle} ${styles.bottomRight}`}
            style={{ 
              cursor: 'se-resize',
              opacity: isHoveringResize ? 1 : 0.7
            }}
            onMouseDown={handleResizeHandleMouseDown}
            title="Drag to resize"
          />
        </div>
      )}
    </div>
  );
};