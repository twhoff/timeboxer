Changelog
Fix persistance
Components:

TimeBlockGrid.tsx: Improved persistence mechanism and code refactoring. Removed unnecessary useEffect and adjusted position calculations for time blocks.

Context:

TimeBlockContext.tsx: Added useEffect hooks for loading and saving time blocks to persistent storage.

Controllers:

useConfetti.ts: Refactored to improve confetti trigger logic.

useTimeBlockPlacement.ts: Enhanced mouse event handling and introduced new logic to prevent event propagation from buttons.

DB:

db.ts: Streamlined load and save operations with better error handling.

Index:

index.tsx: Temporarily removed React.StrictMode for debugging.

Add time block bi-directional growth
Prettier Configuration:

Updated .prettierrc to adjust printWidth.

Documentation:

Added COMMANDS.md with useful command instructions.

README:

Enhanced documentation with structured headings and updated project summary.

ESLint Configuration:

Streamlined ESLint setup for better TypeScript and Prettier integration.

Package.json:

Added @types/canvas-confetti for improved typing support.

CSS:

Improved styling and animations for time blocks, with additions for stretching and bouncing effects.

App Component:

Significant refactoring to split into smaller components (TimeBlockGrid, ScaleColumn, etc.).

Convert to static layout and design tokens
CSS:

Introduced design tokens using CSS variables for better maintainability and theming.

App Component:

Continued refactoring to enhance readability and performance.

TypeScript Configuration:

Updated tsconfig.json for better compatibility and module resolution.

If you need further details or specific entries for particular changes, feel free to ask! This changelog provides a structured overview of what was modified in each commit, excluding the changes to yarn.lock and dist directories as requested.

Convert to TypeScript
General:

Converted project files from JavaScript to TypeScript for improved type safety and maintainability.

Context:

TimeBlockContext.tsx: Added TypeScript interfaces and types.

DB:

db.ts: Defined database schema and updated functions with TypeScript types.

Components:

Refactored components to include TypeScript types for props and state management.

Add some tooling like ESLint and Prettier
Tooling:

Set up ESLint for linting JavaScript and TypeScript files.

Configured Prettier for consistent code formatting, integrating it with ESLint.

Configuration Files:

Added necessary configuration files for ESLint and Prettier.

Updated package.json to include scripts for linting and formatting.

Dependencies:

Installed necessary ESLint and Prettier plugins and configurations.
