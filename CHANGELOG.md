# Changelog

## [Unreleased]

### Components

-   **`App.css`**:

    -   Updated `.note-icon` to `.note-icon-button` for better specificity.
    -   Refined styles for `.mechanical-pencil` with wiggle animation on key press.
    -   Removed redundant styles for `.note-bubble` and adjusted styles for new `.cloud*` classes for fade-in animations.

-   **`DeleteButton.tsx`**:

    -   New atom component for rendering a delete button with SVG.

-   **`LockButton.tsx`**:

    -   New atom component for rendering a lock button with SVG.

-   **`NoteButton.tsx`**:

    -   New atom component for rendering a note button with SVG.
    -   Handles note-related interactions with dynamic styles based on the state.

-   **`TimeBlock.tsx`**:

    -   Refactored to use new atom components: `LockButton`, `DeleteButton`, and `NoteButton`.
    -   Integrated `useTimeBlockHandlers` to manage interactions and state.
    -   Removed inline logic for mouse and key events, delegating them to a custom hook.

-   **`NoteBubble.tsx`**:
    -   Refined to use `bubblePosition` for more accurate positioning.
    -   Added animation and transition for visibility and position changes.
    -   Replaced `CloudShape` with direct styling for note display.

### Context

-   **`TimeBlockContext.tsx`**:
    -   Introduced `useNotes` custom hook to manage notes state.
    -   Removed inline `setNoteForTimeBlock` and `deleteNoteForTimeBlock` in favor of using the hook.

### Controllers

-   **`useLoadTimeBlocks.ts`**:

    -   Updated to use `setNoteForTimeBlock` directly for managing notes during load.

-   **`useNotes.ts`**:

    -   New custom hook for managing notes, providing `setNoteForTimeBlock` and `deleteNoteForTimeBlock`.

-   **`useTimeBlockHandlers.ts`**:
    -   New custom hook to encapsulate logic for handling time block interactions such as locking, deleting, and note interactions.

### Utilities

-   **`colorGenerator.ts`**:
    -   Added `hexToRgba` function for converting hex colors to RGBA format.

### Removed

-   **`CloudShape.tsx`**:
    -   Removed SVG component as the note styling was simplified.

## Add Note-Taking Feature

### Components

-   **`TimeBlock.tsx`**:

    -   Integrated `NoteBubble` component for note-taking functionality.
    -   Added logic to manage note visualization and interaction.
    -   Updated hover logic to include note icons with interactive effects.

-   **`NoteBubble.tsx`**:

    -   Introduced as a new component to handle note creation and editing within time blocks.
    -   Utilizes a cloud-like interface for notes with keyboard shortcuts for saving and closing.

-   **`CloudShape.tsx`**:
    -   Added as a new SVG component to render cloud-like shapes for notes.
    -   Supports dynamic scaling and color customization.

### Context

-   **`TimeBlockContext.tsx`**:
    -   Extended context to manage notes associated with time blocks.
    -   Added `setNoteForTimeBlock` and `deleteNoteForTimeBlock` functions for note management.

### Controllers

-   **`useLoadTimeBlocks.ts`**:
    -   Updated to include loading of notes associated with time blocks.
    -   Integrated note state management alongside time block loading.

### DB

-   **`db.ts`**:
    -   Introduced a new `NOTE_STORE` in IndexedDB to handle note persistence.
    -   Added functions for saving, loading, and deleting notes.

## Fix Persistence

### Components

-   **`TimeBlockGrid.tsx`**:

    -   Improved persistence mechanism and code refactoring.
    -   Enhanced the `renderTimeBlocks` method to include formatted time ranges for better display clarity.
    -   Removed unnecessary `useEffect` and adjusted position calculations for time blocks.

-   **`TimeBlock.tsx`**:
    -   Updated to include a new `timeRange` prop for displaying time ranges on hover.
    -   Refined hover logic for interactive elements like padlock, bin, and note icons.

### Context

-   **`TimeBlockContext.tsx`**:
    -   Added `useEffect` hooks for loading and saving time blocks to persistent storage.

### Controllers

-   **`useConfetti.ts`**:

    -   Refactored to improve confetti trigger logic.

-   **`useTimeBlockPlacement.ts`**:
    -   Enhanced mouse event handling and introduced new logic to prevent event propagation from buttons.
    -   Updated type imports to maintain consistency with database schema.

### DB

-   **`db.ts`**:
    -   Streamlined load and save operations with better error handling.

### Index

-   **`index.tsx`**:
    -   Temporarily removed `React.StrictMode` for debugging.

## Add Time Block Bi-Directional Growth

### Prettier Configuration

-   Updated `.prettierrc` to adjust `printWidth`.

### Documentation

-   Added `COMMANDS.md` with useful command instructions.

### README

-   Enhanced documentation with structured headings and updated project summary.

### ESLint Configuration

-   Streamlined ESLint setup for better TypeScript and Prettier integration.

### Package.json

-   Added `@types/canvas-confetti` for improved typing support.

### CSS

-   Improved styling and animations for time blocks, with additions for stretching and bouncing effects.

### App Component

-   Significant refactoring to split into smaller components (TimeBlockGrid, ScaleColumn, etc.).

## Convert to Static Layout and Design Tokens

### CSS

-   Introduced design tokens using CSS variables for better maintainability and theming.

-   **`App.css`**:
    -   Introduced `.time-block-wrapper` for improved layout management and hover effects.
    -   Added styles for `.note-icon` with interactive effects.
    -   Refined `.time-indicator` styling for better alignment and visibility.

### App Component

-   Continued refactoring to enhance readability and performance.

### TypeScript Configuration

-   Updated `tsconfig.json` for better compatibility and module resolution.

## Convert to TypeScript

### General

-   Converted project files from JavaScript to TypeScript for improved type safety and maintainability.

### Context

-   **`TimeBlockContext.tsx`**:
    -   Added TypeScript interfaces and types.

### DB

-   **`db.ts`**:
    -   Defined database schema and updated functions with TypeScript types.

### Components

-   Refactored components to include TypeScript types for props and state management.

-   **`TimeBlockPreview.tsx`**:
    -   Updated to include the `color` prop for enhanced styling consistency.

## Add Some Tooling like ESLint and Prettier

### Tooling

-   Set up ESLint for linting JavaScript and TypeScript files.
-   Configured Prettier for consistent code formatting, integrating it with ESLint.

### Configuration Files

-   Added necessary configuration files for ESLint and Prettier.
-   Updated `package.json` to include scripts for linting and formatting.

### Dependencies

-   Installed necessary ESLint and Prettier plugins and configurations.

## Recent Changes

### Components

-   **`TimeBlock.tsx`**:

    -   Introduced `useRef` for block reference and cursor management.
    -   Added `blockId` prop and `blockProps` for enhanced block handling.
    -   Implemented `handleMouseMove` for resizing interactions.
    -   Wrapped delete and note buttons in a conditional rendering based on `isSelectedSchedule`.

-   **`TimeBlockPreview.tsx`**:

    -   Refactored to `TimeBlockPreviewComponent` and memoized for performance.

-   **`TimeBlockGrid.tsx`**:
    -   Imported utility functions from `timeBlockUtils` for cleaner code.
    -   Enhanced block rendering logic to support resizing and duplication.
    -   Integrated `useRef` for managing resizing state.
    -   Centralized block rendering logic using a helper function.
    -   Improved performance and maintainability by refactoring repetitive logic.

### Context

-   **`TimeBlockContext.tsx`**:
    -   Removed inline `useEffect` hooks and replaced with custom hooks (`useFetchSchedules`, `useLoadTimeBlocks`, `useSaveData`) for better separation of concerns and code readability.

### Controllers

-   **`useTimeBlockPlacement.ts`**:

    -   Introduced constants and utilities for resizing and placement logic.
    -   Enhanced mouse event logic to handle block resizing.
    -   Utilised `resizeStateRef` for managing resize state.
    -   Added logic for duplicating blocks across days using CMD + Click.

-   **Added**:
    -   **`useFetchSchedules.ts`**: Custom hook to load schedules and associated time blocks.
    -   **`useLoadTimeBlocks.ts`**: Custom hook for loading time blocks based on active schedules.
    -   **`useSaveData.ts`**: Custom hook to save schedules and time blocks persistently.

### DB

-   **`db.ts`**:
    -   Added console logging for saved time blocks to aid debugging.

### Utilities

-   **Added `timeBlockUtils.ts`**:
    -   Centralized utility functions for block formatting, styling, and event handling.

### Documentation

-   **`README.md`**:
    -   Removed redundant sections to streamline content and improve focus on current features and instructions.

## [01-09-2024] - Latest Update

### Components

-   **`TimeBlock.tsx`**:

    -   Introduced `useRef` for block reference and cursor management.
    -   Added `dayIndex` prop to manage time blocks for specific days.
    -   Implemented `handleMouseMove` to change cursor style when hovering near the top/bottom edges of a time block, enabling resizing interactions.
    -   Replaced inline delete logic with a dedicated `handleDeleteClick` function, which triggers confetti on delete action and updates the time blocks state accordingly.

-   **`TimeBlockPreview.tsx`**:

    -   Refactored to remove the `blockProps` prop and directly accept `top`, `height`, and `timeRange` props for improved clarity and performance.

-   **`TimeBlockGrid.tsx`**:
    -   Enhanced mouse event handling to manage resizing and repositioning of time blocks more effectively.
    -   Updated handling of mouse down events to support drag-and-drop functionality for time blocks, allowing for duplication and repositioning.
    -   Simplified rendering logic by integrating a new `calculateBlockProps` utility function for determining block dimensions and positions.
    -   Improved error handling and console logging for debugging schedule and block ID issues.

### Context

-   **`TimeBlockContext.tsx`**:
    -   Removed inline `useEffect` hooks in favour of custom hooks for better separation of concerns and improved readability.

### Controllers

-   **`useTimeBlockPlacement.ts`**:
    -   Refactored to improve control over the resizing and repositioning of time blocks, including new logic for handling event propagation and mouse movements.
    -   Introduced references for managing the state of resizing, creating, duplicating, and repositioning time blocks.

### Utility Functions

-   **`timeBlockUtils.ts`**:
    -   Updated `shouldRenderBlock` utility to account for both resizing and repositioning states, enhancing block visibility logic.

### Constants

-   **`constants.ts`**:
    -   Added `RESIZE_THRESHOLD` constant for consistent handling of resizing interactions across components.

### DB

-   **`db.ts`**:
    -   Streamlined save operations with improved error handling and logging.
