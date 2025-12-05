# Week 10: Todo App - Context API Refactoring

This week focuses on refactoring the Todo App from basic state management to Context API, eliminating prop drilling.

## Folder Structure

### `todo-app-v1/`
**Basic Version** - Uses `useState` with prop drilling

**Features:**
- Basic state management with `useState`
- Props passed through multiple component levels
- Simple but can become unwieldy as app grows

**Key Learning:**
- Component state management
- Props flow in React
- Understanding the prop drilling problem

---

### `todo-app-v4/`
**Context + useReducer Version** - Refactored for better state management

**Features:**
- Global state management with Context API
- `useReducer` for complex state logic
- No prop drilling - components access state directly
- LocalStorage persistence
- Filter functionality (All/Active/Completed)
- NYU Violet theme

**Key Learning:**
- Context API usage
- `useReducer` pattern
- Avoiding prop drilling
- Centralized state management

---

## Version Naming Explanation

**Why V1 and V4?**

Following the course's version progression:
- **V1**: Basic version (this folder)
- **V2**: With API integration (axios + JSON Server) - teacher example
- **V3**: V2 refactored with Context - teacher example
- **V4**: V1 refactored with Context (this folder) - **Week 10 Assignment**

---

## How to Run

Navigate to either folder and run:

```bash
npm install
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

---

## Assignment Objective

**Week 10 Homework:** Refactor V1 to create V4 using Context API.

✅ **Status:** Completed

**What was changed:**
1. Created `TodoContext` for global state management
2. Replaced `useState` with `useReducer`
3. Removed prop drilling throughout component tree
4. Added data persistence with LocalStorage
5. Implemented advanced filtering features
