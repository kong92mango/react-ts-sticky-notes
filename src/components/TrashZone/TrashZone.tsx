import React, { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Position } from '../../types';
import styles from './trashZone.module.css';

interface TrashZoneProps {
  dragPosition?: Position;
  isDragging: boolean;
  draggedNoteId: string | null;
}

export const TrashZone: React.FC<TrashZoneProps> = ({ 
  dragPosition, 
  isDragging, 
  draggedNoteId 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate if note is in delete zone (bottom 100px of screen)
  useEffect(() => {
    if (isDragging && dragPosition && draggedNoteId) {
      const deleteThreshold = window.innerHeight - 100; // Bottom 100px
      const isInDeleteZone = dragPosition.y > deleteThreshold;
      setIsHovered(isInDeleteZone);
    } else {
      setIsHovered(false);
    }
  }, [dragPosition, isDragging, draggedNoteId]);

  const shouldShow = isDragging;

  const getLabel = () => {
    if (isHovered) {
      return 'Release to Delete';
    } else {
      return 'Trash Zone';
    }
  };

  const getSubtitle = () => {
    if (isHovered) {
      return <span className={styles.trashSubtitle}>Let go to delete this note</span>;
    } else {
      return <span className={styles.trashSubtitle}>Drag notes here to delete them</span>;
    }
  };

  return (
    <div 
      className={`${styles.trashZone} ${shouldShow ? styles.visible : ''} ${isHovered ? styles.hovered : ''}`}
      data-testid="trash-zone"
    >
      <div className={styles.trashIcon}>
        <TrashIcon style={{ width: '40px', height: '40px' }} />
      </div>
      <div className={styles.trashLabel}>
        <span>{getLabel()}</span>
        {getSubtitle()}
      </div>
    </div>
  );
};