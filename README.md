# Time Blocking App

## Project Summary

The Time Blocking App is designed to help users manage their time efficiently by allowing them to create and visualise time blocks across various days and intervals. The application offers an intuitive interface to facilitate effective time management.

## Current State

### Core Features Implemented:

-   **Grid Layout**: Displays days of the week and time intervals in a structured grid format.
-   **Time Block Creation**: Users can create time blocks by clicking and dragging within day columns.
-   **Dynamic Time Indicator**: Provides real-time feedback for selected time intervals.
-   **Persistent State**: Time blocks are stored persistently using IndexedDB.

### Recent Fixes and Improvements:

-   **CSS Layout Updates**: Utilised CSS variables for improved consistency and maintainability, setting a foundation for future theming and design tokens.
-   **Alignment Issues**: Resolved using static heights for intervals and time blocks to ensure consistent visual alignment.
-   **Styling Consistency**: Applied `box-sizing: border-box` globally for predictable layout dimensions.

### Tooling Setup:

-   **TypeScript Integration**: Successfully migrated core files to TypeScript for improved type safety.
-   **ESLint and Prettier**: Configured for code consistency with specific formatting rules.
-   **Parcel Bundler**: Upgraded to the latest version for improved build performance and compatibility.

## Next Steps

1. **Complete TypeScript Migration**: Ensure all files are converted to TypeScript.
2. **Testing**: Implement unit and integration tests using Jest and React Testing Library to ensure robust functionality and prevent regressions.

### Feature Enhancements:

-   Explore adding local storage or service workers to enhance offline persistence capabilities.
-   Develop a theming system leveraging CSS variables for different design tokens or modes.
-   Refine the user interface for improved user experience, making it more intuitive and visually appealing.

## How to Pick Up the Project

### Review the Codebase:

-   Familiarise yourself with the current state by reviewing key files and understanding the architecture.

### Set Up the Development Environment:

-   Ensure dependencies are installed by running `yarn install`.
-   Start the development server using `yarn start`.

### Focus Areas:

-   Continue with the TypeScript migration and testing as outlined in the next steps.
-   Prioritise any immediate UI/UX improvements based on user feedback or testing outcomes.

## Contact

For any questions or further clarification, feel free to reach out to the team or check the project's issue tracker for more details on specific tasks.
