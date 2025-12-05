import { createContext, useReducer, useContext, useEffect } from 'react';
import todoReducer from './todoReducer';

const TodoContext = createContext();

// Load from LocalStorage or use default
const getInitialTodos = () => {
    const savedTodos = localStorage.getItem('personal-todo-app-data');
    if (savedTodos) {
        return JSON.parse(savedTodos);
    }
    return [
        { id: 1, text: 'Learn React Context', completed: true, createdAt: Date.now() - 100000 },
        { id: 2, text: 'Master useReducer', completed: false, createdAt: Date.now() }
    ];
};

const initialState = {
    todos: getInitialTodos(),
    filter: 'all', // all, active, completed
    sortBy: 'date' // date, status
};

export const TodoProvider = ({ children }) => {
    const [state, dispatch] = useReducer(todoReducer, initialState);

    // Save to LocalStorage whenever todos change
    useEffect(() => {
        localStorage.setItem('personal-todo-app-data', JSON.stringify(state.todos));
    }, [state.todos]);

    // Helper to get filtered and sorted todos
    const getFilteredAndSortedTodos = () => {
        let result = [...state.todos];

        // 1. Filter
        if (state.filter === 'active') {
            result = result.filter(todo => !todo.completed);
        } else if (state.filter === 'completed') {
            result = result.filter(todo => todo.completed);
        }

        // 2. Sort
        result.sort((a, b) => {
            if (state.sortBy === 'date') {
                return b.createdAt - a.createdAt; // Newest first
            } else if (state.sortBy === 'status') {
                // Uncompleted first
                return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
            }
            return 0;
        });

        return result;
    };

    const value = {
        todos: state.todos,
        filter: state.filter,
        sortBy: state.sortBy,
        visibleTodos: getFilteredAndSortedTodos(),
        activeCount: state.todos.filter(t => !t.completed).length,
        dispatch
    };

    return (
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodo must be used within a TodoProvider');
    }
    return context;
};
