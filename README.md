# Sticky Notes App

A modern, interactive sticky notes application built with React and TypeScript. Create, organize, and manage your notes with an intuitive drag-and-drop interface.

## Features

### Core Functionality
- **Create Notes**: Generate sticky notes in multiple colors with auto-numbering
- **Drag & Drop**: Move notes around the canvas by dragging the header
- **Resize Notes**: Drag the bottom-right corner to resize notes
- **Delete Notes**: Drag notes to the bottom trash zone to delete them
- **Local Storage**: All notes are automatically saved and persist between sessions
- **Color Selection**: Choose from 8 predefined colors for your notes

### User Interface
- **Clean Design**: Cork board background with realistic note shadows
- **Real-time Feedback**: Visual indicators for drag, resize, and delete operations
- **Responsive Layout**: Works on desktop and touch devices
- **Empty State**: Helpful instructions when no notes exist
- **Confirmation Dialogs**: Prevents accidental deletion of all notes

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:kong92mango/react-ts-sticky-notes.git
   cd sticky-notes-app
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   ```

### Running the Application

**Development Mode**
```bash
# Using npm
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

**Production Build**
```bash
# Using npm
npm run build
```

## How to Use

1. **Creating Notes**: Click the "Add Note" button in the toolbar
2. **Changing Colors**: Click the color picker to select a different color before creating a note
3. **Moving Notes**: Click and drag the note header to move notes around
4. **Resizing Notes**: Click and drag the bottom-right corner to resize
5. **Editing Content**: Click inside a note to start typing
6. **Deleting Notes**: Drag a note to the red trash zone at the bottom
7. **Clear All**: Use the "Clear All Notes" button to delete all notes (with confirmation)

## Technical Details

### Technologies Used
- **React 18** with TypeScript
- **CSS Modules** for component styling
- **Context API** for state management
- **Heroicons** for UI icons
- **Local Storage API** for data persistence

### Project Structure
```
src/
├── components/
│   ├── Note/           # Individual note component
│   ├── NoteCanvas/     # Main canvas container
│   ├── Toolbar/        # Top navigation bar
│   └── TrashZone/      # Deletion area
├── context/            # React context for state management
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Helper functions and constants
```

### Key Features Implementation
- **Drag System**: Uses mouse/touch events with offset calculations for smooth dragging
- **Resize Logic**: Bottom-right corner only, maintains square aspect ratio
- **Change Layering Logic**: Fuction to bring most recently clicked on note to front, on top of other notes
- **Position Management**: Top-left corner reference point for consistent positioning
- **State Persistence**: Automatic saving to localStorage with versioning
- **Delete Zone**: Dynamic trash area that appears during drag operations

## Available Scripts

- `start` - Runs development server
- `build` - Creates production build
- `test` - Runs test suite
- `eject` - Ejects from Create React App (one-way operation)

## Browser Support

Modern browsers with ES6+ support including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

Feel free to submit issues and enhancement requests. The codebase uses:
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting