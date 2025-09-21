import { Position } from '../types';
import { MIN_NOTE_SIZE, MAX_NOTE_SIZE, RESIZE_HANDLE_SIZE } from './constants';

export const clampSize = (size: number): number => {
  if (typeof size !== 'number' || !isFinite(size)) {
    return MIN_NOTE_SIZE;
  }
  return Math.max(MIN_NOTE_SIZE, Math.min(size, MAX_NOTE_SIZE));
};

export const calculateResizedSize = (
  startSize: number,
  currentMousePosition: Position,
  dragStartPosition: Position
): number => {
  if (typeof startSize !== 'number' || !isFinite(startSize)) {
    return MIN_NOTE_SIZE;
  }
  
  if (!currentMousePosition || !dragStartPosition || 
      typeof currentMousePosition.x !== 'number' || 
      typeof currentMousePosition.y !== 'number' ||
      typeof dragStartPosition.x !== 'number' || 
      typeof dragStartPosition.y !== 'number') {
    return clampSize(startSize);
  }

  // Calculate based on the diagonal movement from bottom-right corner
  const deltaX = currentMousePosition.x - dragStartPosition.x;
  const deltaY = currentMousePosition.y - dragStartPosition.y;
  
  // Use the larger of the two deltas to maintain square aspect ratio
  const delta = Math.max(deltaX, deltaY);
  
  const newSize = startSize + delta;
  return clampSize(newSize);
};

export const getResizeHandlePosition = (
  notePosition: Position,
  noteSize: number,
  handleSize: number = RESIZE_HANDLE_SIZE
): Position | null => {
  if (!notePosition || 
      typeof notePosition.x !== 'number' || 
      typeof notePosition.y !== 'number' ||
      typeof noteSize !== 'number' || 
      typeof handleSize !== 'number') {
    return null;
  }

  const { x, y } = notePosition;
  const halfHandle = handleSize / 2;
  return { x: x + noteSize - halfHandle, y: y + noteSize - halfHandle };
};

export const isPointInResizeHandle = (
  point: Position,
  notePosition: Position,
  noteSize: number,
  handleSize: number = RESIZE_HANDLE_SIZE
): boolean => {
  if (!point || !notePosition || 
      typeof point.x !== 'number' || typeof point.y !== 'number' ||
      typeof notePosition.x !== 'number' || typeof notePosition.y !== 'number' ||
      typeof noteSize !== 'number' || typeof handleSize !== 'number') {
    return false;
  }

  const handlePos = getResizeHandlePosition(notePosition, noteSize, handleSize);
  if (!handlePos) return false;
  
  const expandedSize = handleSize + 4; // some extra hit area
  
  return (
    point.x >= handlePos.x - 2 &&
    point.x <= handlePos.x + expandedSize + 2 &&
    point.y >= handlePos.y - 2 &&
    point.y <= handlePos.y + expandedSize + 2
  );
};

export const getResizeHandleAtPosition = (
  point: Position,
  notePosition: Position,
  noteSize: number
): boolean => {
  return isPointInResizeHandle(point, notePosition, noteSize);
};