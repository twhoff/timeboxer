# Time Blocking App

## Project Summary

The Time Blocking App is designed to help users manage their time efficiently by allowing them to create and visualise time blocks across various days and intervals. The application offers an intuitive interface to facilitate effective time management.

## Current State

### Project Structure

```
/Users/thoffmann/Desktop/timeboxer
├── CHANGELOG.md
├── COMMANDS.md
├── README.md
├── eslint.config.mjs
├── package.json
├── public
│   └── index.html
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── components
│   │   ├── atoms
│   │   │   ├── IntervalLine.tsx
│   │   │   ├── TimeHeader.tsx
│   │   │   └── TimeLabel.tsx
│   │   ├── molecules
│   │   │   ├── ScaleColumn.tsx
│   │   │   ├── TimeBlock.tsx
│   │   │   └── TimeBlockPreview.tsx
│   │   └── organisms
│   │       ├── Sidebar.tsx
│   │       └── TimeBlockGrid.tsx
│   ├── context
│   │   └── TimeBlockContext.tsx
│   ├── controllers
│   │   ├── useConfetti.ts
│   │   ├── useFetchSchedules.ts
│   │   ├── useLoadTimeBlocks.ts
│   │   ├── useSaveData.ts
│   │   └── useTimeBlockPlacement.ts
│   ├── db.ts
│   ├── index.tsx
│   └── utils
│       ├── colorGenerator.ts
│       └── timeBlockUtils.ts
├── tsconfig.json
└── yarn.lock

10 directories, 28 files
```

## Time Blocker Project - Key File Summaries

### `db.ts`

-   **Purpose**: Manages data persistence for the application using IndexedDB.
-   **Key Features**:
    -   Defines data structures for `TimeBlock` and `Schedule`.
    -   Initializes the database with necessary stores.
    -   Provides CRUD operations for time blocks and schedules.
    -   Manages a color rotation value for dynamic color assignment.
-   **Technologies**: Utilizes the `idb` package for a promise-based IndexedDB interaction.

### `TimeBlockGrid.tsx`

-   **Purpose**: Serves as the primary UI component for displaying and interacting with time blocks.
-   **Key Features**:
    -   Utilizes `useTimeBlockContext` for state management.
    -   Handles user interactions for adding, deleting, and adjusting time blocks.
    -   Dynamically renders time blocks with visual feedback (e.g., confetti on delete, bouncing animation).
-   **Technologies**: Built with React, integrating custom hooks like `useTimeBlockPlacement` and `useConfetti`.

### `TimeBlockContext.tsx`

-   **Purpose**: Establishes a global state management system for time blocks and schedules.
-   **Key Features**:
    -   Exports `useTimeBlockContext` hook for accessing the context.
    -   Manages state for time blocks, schedules, and the selected schedule.
    -   Implements persistence with loading and saving data to IndexedDB.
-   **Technologies**: Utilizes React Context and Hooks for effective state management across components.

### `useTimeBlockPlacement.ts`

-   **Purpose**: Manages the logic for placing and dragging time blocks within the grid.
-   **Key Features**:
    -   Provides interactive logic for adding new blocks and adjusting existing ones.
    -   Offers real-time visual feedback during drag operations.
    -   Integrates with `useTimeBlockContext` for reflecting changes in the global state.
-   **Technologies**: A custom React hook that leverages mouse event handling and UUID generation for unique identifiers.

### `timeBlockUtils.ts`

-   **Purpose**: Contains utility functions to support time block operations.
-   **Key Features**:
    -   Provides functions for formatting time intervals and managing block styles.
    -   Includes helper functions to ensure correct event handling.
-   **Technologies**: JavaScript utilities to facilitate component logic.

### Core Features Implemented

-   **Bi-Directional Growth for Time Blocks**: Enables time blocks to expand or shrink in both directions for more flexible time management.
-   **Persistence Mechanism**: Enhanced to ensure the reliable storage and retrieval of time blocks, improving the application's usability across sessions.
-   **Static Layout and Design Tokens**: Transitioned to a static layout using CSS variables for design tokens, facilitating easier theming and consistent styling.
-   **Tooling and Quality Assurance**: Added ESLint and Prettier for code quality, along with TypeScript conversion for type safety, enhancing overall code maintainability and development experience.
-   **Animation and UI Feedback**: Introduced animations for time blocks and added visual indicators (like confetti on certain actions), enriching the user interface and interaction feedback.

### Recent Fixes and Improvements

-   **TypeScript Integration**: Converted project files to TypeScript for improved type safety and development efficiency.
-   **Tooling Setup**: Configured ESLint and Prettier for consistent code quality, ensuring a uniform coding standard across the project.
-   **CSS Layout Updates**: Utilised CSS variables for improved consistency and maintainability, setting a foundation for future theming and design tokens.
-   **Performance Enhancements**: Refactored components like `TimeBlockGrid` and `TimeBlock` for better readability and performance, ensuring smoother user experiences.
-   **Resizing and Duplication Logic**: Enhanced user interactions for resizing blocks and duplicating across days using CMD + Click for improved flexibility.
