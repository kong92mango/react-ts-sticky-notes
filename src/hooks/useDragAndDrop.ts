import { useCallback, useRef, useState } from 'react';
import { Position } from '../types';
import { DRAG_THRESHOLD } from '../utils/constants';
import { calculateResizedSize } from '../utils/sizing';

interface UseDragAndDropProps {
  onDragStart?: (noteId: string, startPosition: Position, offset: Position) => void;
  onDragMove?: (position: Position) => void;
  onDragEnd?: (position: Position) => void;
  onDrop?: (noteId: string, position: Position) => void;
  onResizeStart?: (noteId: string, startPosition: Position, startSize: number) => void;
  onResizeMove?: (noteId: string, newSize: number) => void;
  onResizeEnd?: (noteId: string, finalSize: number) => void;
}

export const useDragAndDrop = ({
  onDragStart,
  onDragMove,
  onDragEnd,
  onDrop,
  onResizeStart,
  onResizeMove,
  onResizeEnd
}: UseDragAndDropProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);
  const dragStartPosition = useRef<Position>({ x: 0, y: 0 });
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const resizeStartSize = useRef<number>(0);
  const hasMoved = useRef(false);

  // Unified event handler for both mouse and touch events
  const getEventPosition = (event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): Position => {
    if ('touches' in event) {
      const touchEvent = event as React.TouchEvent | TouchEvent;
      const touch = 'changedTouches' in touchEvent && touchEvent.changedTouches.length > 0 
        ? touchEvent.changedTouches[0] 
        : touchEvent.touches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    const mouseEvent = event as React.MouseEvent | MouseEvent;
    return { x: mouseEvent.clientX, y: mouseEvent.clientY };
  };

  const handleInteractionStart = useCallback((
    event: React.MouseEvent | React.TouchEvent,
    noteId: string,
    notePosition: Position
  ) => {
    event.preventDefault();
    
    const eventPosition = getEventPosition(event);
    
    // Calculate offset from note's top-left corner to event position
    const offset = {
      x: eventPosition.x - notePosition.x,
      y: eventPosition.y - notePosition.y
    };

    dragStartPosition.current = eventPosition;
    dragOffset.current = offset;
    setDraggedNoteId(noteId);
    hasMoved.current = false;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const currentPosition = getEventPosition(e);
      const distance = Math.sqrt(
        Math.pow(currentPosition.x - dragStartPosition.current.x, 2) +
        Math.pow(currentPosition.y - dragStartPosition.current.y, 2)
      );

      if (distance > DRAG_THRESHOLD && !isDragging) {
        setIsDragging(true);
        hasMoved.current = true;
        onDragStart?.(noteId, dragStartPosition.current, offset);
      }

      if (isDragging || hasMoved.current) {
        onDragMove?.(currentPosition);
      }
    };

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      const endPosition = getEventPosition(e);
            
      if (isDragging || hasMoved.current) {
        onDragEnd?.(endPosition);
        onDrop?.(noteId, endPosition);
      }

      setIsDragging(false);
      setDraggedNoteId(null);
      hasMoved.current = false;
      
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  }, [isDragging, onDragStart, onDragMove, onDragEnd, onDrop]);

  const handleMouseDown = useCallback((
    event: React.MouseEvent,
    noteId: string,
    notePosition: Position
  ) => {
    handleInteractionStart(event, noteId, notePosition);
  }, [handleInteractionStart]);

  const handleTouchStart = useCallback((
    event: React.TouchEvent,
    noteId: string,
    notePosition: Position
  ) => {
    handleInteractionStart(event, noteId, notePosition);
  }, [handleInteractionStart]);

  const handleResizeStart = useCallback((
    event: React.MouseEvent,
    noteId: string,
    startSize: number
  ) => {
    event.preventDefault();
    event.stopPropagation();
    
    const mousePosition = getEventPosition(event);

    dragStartPosition.current = mousePosition;
    resizeStartSize.current = startSize;
    setIsResizing(true);
    setDraggedNoteId(noteId);
    
    onResizeStart?.(noteId, mousePosition, startSize);

    const handleMouseMove = (e: MouseEvent) => {
      const currentPosition = getEventPosition(e);
      const newSize = calculateResizedSize(
        resizeStartSize.current,
        currentPosition,
        dragStartPosition.current
      );
      
      onResizeMove?.(noteId, newSize);
    };

    const handleMouseUp = (e: MouseEvent) => {
      const currentPosition = getEventPosition(e);
      const finalSize = calculateResizedSize(
        resizeStartSize.current,
        currentPosition,
        dragStartPosition.current
      );
      
      onResizeEnd?.(noteId, finalSize);
      
      setIsResizing(false);
      setDraggedNoteId(null);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onResizeStart, onResizeMove, onResizeEnd]);

  return {
    isDragging,
    isResizing,
    draggedNoteId,
    handleMouseDown,
    handleTouchStart,
    handleResizeStart
  };
};