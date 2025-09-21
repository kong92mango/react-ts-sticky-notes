export const NOTE_COLORS = [
  '#FFF59D', // Light Yellow
  '#FFAB91', // Light Orange
  '#A5D6A7', // Light Green
  '#90CAF9', // Light Blue
  '#F48FB1', // Light Pink
  '#CE93D8', // Light Purple
  '#FFCC02', // Yellow
  '#FF8A65'  // Orange
];

export const DEFAULT_NOTE = {
  size: 200,
  color: NOTE_COLORS[0],
  content: ''
};

export const MIN_NOTE_SIZE = 100; 
export const MAX_NOTE_SIZE = 400; 

export const CANVAS_PADDING = 20;
export const TOOL_BAR_HEIGHT = 80; 
export const DELETE_ZONE_HEIGHT = 100; 
export const TRASH_ZONE_BUFFER = 120; 
export const RESIZE_HANDLE_SIZE = 8;
export const DRAG_THRESHOLD = 3;

export const STORAGE_KEYS = {
  LOCAL_STORAGE: 'sticky-notes-data'
};

export const STORAGE_VERSION = '1.0.0';

export const Z_INDEX = {
  BASE: 1,
  INCREMENT: 1,
  DRAGGING: 9999
};