# Changelog

## Fix Persistence

### Components

-   **`TimeBlockGrid.tsx`**:

    -   Improved persistence mechanism and code refactoring.
    -   Enhanced the `renderTimeBlocks` method to include formatted time ranges for better display clarity. Introduced the `formatTime` function for converting intervals to human-readable time strings.
    -   Removed unnecessary `useEffect` and adjusted position calculations for time blocks.

-   **`TimeBlock.tsx`**:
    -   Updated to include a new `timeRange` prop for displaying time ranges on hover.
    -   Refined hover logic for interactive elements like padlock, bin, and note icons.

### Context

-   **`TimeBlockContext.tsx`**: Added `useEffect` hooks for loading and saving time blocks to persistent storage.

### Controllers

-   **`useConfetti.ts`**: Refactored to improve confetti trigger logic.
-   **`useTimeBlockPlacement.ts`**:
    -   Enhanced mouse event handling and introduced new logic to prevent event propagation from buttons.
    -   Updated type imports to maintain consistency with database schema.

### DB

-   **`db.ts`**: Streamlined load and save operations with better error handling.

### Index

-   **`index.tsx`**: Temporarily removed `React.StrictMode` for debugging.

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

-   **`TimeBlockContext.tsx`**: Added TypeScript interfaces and types.

### DB

-   **`db.ts`**: Defined database schema and updated functions with TypeScript types.

### Components

-   Refactored components to include TypeScript types for props and state management.
-   **`TimeBlockPreview.tsx`**: Updated to include the `color` prop for enhanced styling consistency.

## Add Some Tooling like ESLint and Prettier

### Tooling

-   Set up ESLint for linting JavaScript and TypeScript files.
-   Configured Prettier for consistent code formatting, integrating it with ESLint.

### Configuration Files

-   Added necessary configuration files for ESLint and Prettier.
-   Updated `package.json` to include scripts for linting and formatting.

### Dependencies

-   Installed necessary ESLint and Prettier plugins and configurations.
