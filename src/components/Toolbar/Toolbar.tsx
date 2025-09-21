import React, { useState } from 'react';
import { TrashIcon, PaintBrushIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useNotes } from '../../context/NotesContext';
import { NOTE_COLORS, DEFAULT_NOTE } from '../../utils/constants';
import { getRandomPosition } from '../../utils/positioning';
import styles from './toolbar.module.css';

export const Toolbar: React.FC = () => {
  const { createNote, clearAllNotes, state } = useNotes();
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleCreateNote = () => {
    const canvasSize = {
      width: window.innerWidth,
      height: window.innerHeight - 100
    };
    
    const noteSize = DEFAULT_NOTE.size;
    const position = getRandomPosition(canvasSize, noteSize);
    
    createNote(position, noteSize, selectedColor);
    setIsColorPickerOpen(false);
  };

  const handleClearAllNotes = () => {
    if (state.notes.length === 0) return;
    setShowClearConfirm(true);
  };

  const confirmClearAll = () => {
    clearAllNotes();
    setShowClearConfirm(false);
  };

  const cancelClearAll = () => {
    setShowClearConfirm(false);
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.leftSection}>
        <h1 className={styles.title}>Sticky Notes</h1>
        <span className={styles.noteCount}>
          {state.notes.length} {state.notes.length === 1 ? 'note' : 'notes'}
        </span>
        {state.notes.length > 0 && (
          <span className={styles.nextNumber}>
            Next: Sticky Note {state.noteCounter}
          </span>
        )}
      </div>
      
      <div className={styles.rightSection}>
        {state.notes.length > 0 && (
          <button
            className={`${styles.toolbarButton} ${styles.clearButton}`}
            onClick={handleClearAllNotes}
            title="Clear all sticky notes"
          >
            <TrashIcon style={{ width: '14px', height: '14px' }} />
            Clear All Notes
          </button>
        )}

        <div className={styles.colorPicker}>
          <button
            className={styles.colorButton}
            style={{ backgroundColor: selectedColor }}
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
            title="Choose note color"
          >
            <PaintBrushIcon style={{ width: '16px', height: '16px', color: 'white', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }} />
          </button>
          
          {isColorPickerOpen && (
            <div className={styles.colorPalette}>
              {NOTE_COLORS.map((color) => (
                <button
                  key={color}
                  className={`${styles.colorOption} ${color === selectedColor ? styles.selected : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setSelectedColor(color);
                    setIsColorPickerOpen(false);
                  }}
                  title={`Select ${color}`}
                />
              ))}
            </div>
          )}
        </div>
        
        <button
          className={`${styles.toolbarButton} ${styles.createButton}`}
          onClick={handleCreateNote}
          title="Create new sticky note"
        >
          <PlusIcon style={{ width: '14px', height: '14px' }} />
          Add Note
        </button>
      </div>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className={styles.modalOverlay} onClick={cancelClearAll}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <TrashIcon style={{ width: '48px', height: '48px', color: '#d32f2f', margin: '0 auto' }} />
            </div>
            <h3 className={styles.modalTitle}>Clear All Notes?</h3>
            <p className={styles.modalMessage}>
              This will permanently delete all {state.notes.length} sticky notes and reset the counter. 
              This action cannot be undone.
            </p>
            <div className={styles.modalButtons}>
              <button 
                className={styles.cancelButton} 
                onClick={cancelClearAll}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmButton} 
                onClick={confirmClearAll}
              >
                Clear All Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};