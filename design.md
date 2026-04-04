# Tech Stack
React + TypeScript + Zustand + Antd

# Design
1. State Management: Use Zustand to create a global state for tableData, shared across the entire app.

2. Componentization: Divide the app into multiple components, each responsible for specific functions.

    - VarTable: Displays the variable table, where users can add, delete, and modify variables in the table.

    - CellInput: Displays input boxes in the table, where users can enter variable names, default values, and comments.

    - StandardTextInput: Displays standard text input boxes, where users can input standard text formats. Supports import and export.

3. Common Utilities: The standardTextManager class provides the following functions.

    - Import variable table data in standard text format.

    - Export variable table data to standard text format.

4. Data Persistence: Use localStorage to store tableData, ensuring data is not lost after page refresh.
