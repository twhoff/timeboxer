# Time Blocking App

## Project Summary

The Time Blocking App is designed to help users manage their time efficiently by allowing them to create and visualise time blocks across various days and intervals. The application offers an intuitive interface to facilitate effective time management, now with added functionality for note-taking within time blocks.

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
│   │   │   ├── CloudShape.tsx
│   │   │   ├── ScaleColumn.tsx
│   │   │   ├── TimeBlock.tsx
│   │   │   └── TimeBlockPreview.tsx
│   │   └── organisms
│   │       ├── NoteBubble.tsx
│   │       ├── Sidebar.tsx
│   │       └── TimeBlockGrid.tsx
│   ├── constants
│   │   └── constants.ts
│   ├── context
│   │   └── TimeBlockContext.tsx
│   ├── controllers
│   │   ├── useConfetti.ts
│   │   ├── useCreateTimeBlock.ts
│   │   ├── useFetchSchedules.ts
│   │   ├── useLoadTimeBlocks.ts
│   │   ├── useSaveData.ts
│   │   └── useTimeBlockPlacement.ts
│   ├── db.ts
│   ├── index.tsx
│   └── utils
│       ├── blockUtils.ts
│       ├── colorGenerator.ts
│       ├── eventUtils.ts
│       ├── mouseUtils.ts
│       └── timeBlockUtils.ts
├── tsconfig.json
└── yarn.lock

11 directories, 37 files
```

## Time Blocker Project - Key File Summaries

### `db.ts`

-   **Purpose**: Manages data persistence for the application using IndexedDB.
-   **Key Features**:
    -   Defines data structures for `TimeBlock`, `Schedule`, and `Note`.
    -   Initializes the database with necessary stores.
    -   Provides CRUD operations for time blocks, schedules, and notes.
    -   Manages a color rotation value for dynamic color assignment.
-   **Technologies**: Utilizes the `idb` package for a promise-based IndexedDB interaction.

### `NoteBubble.tsx`

-   **Purpose**: Provides a UI component for creating and displaying notes associated with specific time blocks.
-   **Key Features**:
    -   Allows users to add and edit notes within a bubble interface.
    -   Integrates with the `CloudShape` component for a visually appealing design.
    -   Supports keyboard shortcuts for saving and closing notes.
-   **Technologies**: Built with React, utilizing portals and hooks for effect management.

### `TimeBlock.tsx`

-   **Purpose**: Serves as a component for individual time block representation.
-   **Key Features**:
    -   Integrates `NoteBubble` for note-taking functionality.
    -   Manages interactions for displaying and editing notes.
    -   Utilizes context for state management of time blocks and notes.
-   **Technologies**: Built with React, leveraging custom hooks and context for state management.

### `CloudShape.tsx`

-   **Purpose**: Provides a visual SVG component used in the `NoteBubble`.
-   **Key Features**:
    -   Renders multiple bubble shapes to create a cloud-like appearance.
    -   Scales dynamically based on provided dimensions and colors.
-   **Technologies**: React component utilizing SVG for vector graphics.

### Core Features Implemented

-   **Bi-Directional Growth for Time Blocks**: Enables time blocks to expand or shrink in both directions for more flexible time management.
-   **Persistence Mechanism**: Enhanced to ensure the reliable storage and retrieval of time blocks and notes, improving application's usability across sessions.
-   **Static Layout and Design Tokens**: Transitioned to a static layout using CSS variables for design tokens, facilitating easier theming and consistent styling.
-   **Tooling and Quality Assurance**: Added ESLint and Prettier for code quality, along with TypeScript conversion for type safety, enhancing overall code maintainability and development experience.
-   **Animation and UI Feedback**: Introduced animations for time blocks and added visual indicators (like confetti on certain actions), enriching the user interface and interaction feedback.
-   **Note Management**: Allows users to create, edit, and delete notes associated with time blocks, providing an additional layer of functionality for time management.

### Recent Fixes and Improvements

-   **TypeScript Integration**: Converted project files to TypeScript for improved type safety and development efficiency.
-   **Tooling Setup**: Configured ESLint and Prettier for consistent code quality, ensuring a uniform coding standard across the project.
-   **CSS Layout Updates**: Utilised CSS variables for improved consistency and maintainability, setting a foundation for future theming and design tokens.
-   **Performance Enhancements**: Refactored components like `TimeBlockGrid` and `TimeBlock` for better readability and performance, ensuring smoother user experiences.
-   **Resizing and Duplication Logic**: Enhanced user interactions for resizing blocks and duplicating across days using CMD + Click for improved flexibility.
-   **Note Feature Enhancement**: Implemented a new note-taking feature within time blocks, allowing for detailed annotations directly in the app.
