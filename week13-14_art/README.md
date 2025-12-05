# NYU Art Collection Manager

A React application for managing a personal art collection, built with Redux Toolkit and Tailwind CSS.

## Features

- **Add Art**: Users can add new art pieces with a name and price.
- **View Collection**: Displays a list of all added art items.
- **Search & Filter**: Filter the art list by name using the search bar.
- **Total Value**: Automatically calculates and displays the total value of all *visible* (filtered) art items.
- **Delete**: Remove individual items from the collection.
- **Smart Highlighting**: When adding a new item, if the name partially matches an existing item in the list, the existing item is highlighted (bold text + purple background).

## Tech Stack

- **React**: UI library.
- **Redux Toolkit**: State management (slices for `form` and `art`).
- **Tailwind CSS**: Styling (using NYU official color palette).
- **Vite**: Build tool and development server.

## Design

The application uses the official NYU color palette:
- **Primary Color**: NYU Violet (`#57068c`)
- **Secondary Color**: Ultra Violet (`#8900e1`)

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the development server**:
    ```bash
    npm start
    ```

3.  **Open in browser**:
    Navigate to `http://localhost:3000`
