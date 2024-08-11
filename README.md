# Time Blocking App

## Project Summary

The Time Blocking App is designed to help users manage their time efficiently by allowing them to create and visualise time blocks across various days and intervals. The application offers an intuitive interface to facilitate effective time management.

## Current State

### Core Features Implemented

-   **Grid Layout**: Displays days of the week and time intervals in a structured grid format.
-   **Time Block Creation**: Users can create time blocks by clicking and dragging within day columns.
-   **Dynamic Time Indicator**: Provides real-time feedback for selected time intervals.
-   **Persistent State**: Time blocks are stored persistently using IndexedDB.

### Recent Fixes and Improvements

-   **TypeScript Integration**: Converted project files to TypeScript for improved type safety.
-   **Tooling Setup**: Configured ESLint and Prettier for consistent code quality.
-   **CSS Layout Updates**: Utilised CSS variables for improved consistency and maintainability, setting a foundation for future theming and design tokens.
-   **Performance Enhancements**: Refactored components for better readability and performance.

## Next Steps

1. **Add Schedules**: Introduce the concept of Schedules, which will be groups of time blocks across multiple days, allowing multiple blocks per day.
2. **Update Selection Interval**: Change the time block selection interval to 15 minutes. Adjust the pixel threshold per interval to 25% of the height (using `rem` units for precision).

### Feature Enhancements

-   **Explore Theming**: Develop a theming system leveraging CSS variables for different design tokens or modes.
-   **Refine UI/UX**: Continue refining the user interface for improved user experience, making it more intuitive and visually appealing.

## How to Pick Up the Project

### Review the Codebase

-   Familiarise yourself with the current state by reviewing key files and understanding the architecture.

### Set Up the Development Environment

-   Ensure dependencies are installed by running `yarn install`.
-   Start the development server using `yarn start`.

### Focus Areas

-   Continue with the TypeScript migration and testing as outlined in the next steps.
-   Prioritise any immediate UI/UX improvements based on user feedback or testing outcomes.

## Contact

For any questions or further clarification, feel free to reach out to the team or check the project's issue tracker for more details on specific tasks.
