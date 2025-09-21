import { Position } from '../types';
import { CANVAS_PADDING, DELETE_ZONE_HEIGHT, TOOL_BAR_HEIGHT, TRASH_ZONE_BUFFER } from './constants';

export const generateId = (): string => {
  return `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const clampPosition = (
  position: Position, 
  noteSize: number, 
  canvasSize: { width: number; height: number }
): Position => {
  if (!position || typeof position.x !== 'number' || typeof position.y !== 'number' ||
      typeof noteSize !== 'number' || !canvasSize ||
      typeof canvasSize.width !== 'number' || typeof canvasSize.height !== 'number') {
    return { x: CANVAS_PADDING, y: TOOL_BAR_HEIGHT + CANVAS_PADDING };
  }

  return {
    x: Math.max(CANVAS_PADDING, Math.min(position.x, canvasSize.width - noteSize - CANVAS_PADDING)),
    y: Math.max(CANVAS_PADDING, Math.min(position.y, canvasSize.height - noteSize - CANVAS_PADDING))
  };
};

export const isPointInRect = (
  point: Position,
  rect: { x: number; y: number; width: number; height: number }
): boolean => {
  if (!point || !rect ||
      typeof point.x !== 'number' || typeof point.y !== 'number' ||
      typeof rect.x !== 'number' || typeof rect.y !== 'number' ||
      typeof rect.width !== 'number' || typeof rect.height !== 'number') {
    return false;
  }

  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
};

export const getRandomPosition = (
  canvasSize: { width: number; height: number }, 
  noteSize: number
): Position => {
  if (!canvasSize || typeof canvasSize.width !== 'number' || 
      typeof canvasSize.height !== 'number' || typeof noteSize !== 'number') {
    return { x: CANVAS_PADDING, y: TOOL_BAR_HEIGHT + CANVAS_PADDING };
  }
  
  const availableWidth = canvasSize.width - noteSize - CANVAS_PADDING * 2;
  const availableHeight = canvasSize.height - noteSize - TOOL_BAR_HEIGHT - TRASH_ZONE_BUFFER - CANVAS_PADDING * 2;
  
  return {
    x: CANVAS_PADDING + Math.random() * Math.max(0, availableWidth),
    y: TOOL_BAR_HEIGHT + CANVAS_PADDING + Math.random() * Math.max(0, availableHeight)
  };
};

export const getDeleteThreshold = (): number => {
  return window.innerHeight - DELETE_ZONE_HEIGHT;
};

export const isInDeleteZone = (position: Position): boolean => {
  if (!position || typeof position.y !== 'number') {
    return false;
  }
  return position.y > getDeleteThreshold();
};