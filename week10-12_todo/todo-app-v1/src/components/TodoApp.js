import { useState } from 'react';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import TodoFilter from './TodoFilter';

const TodoApp = () => {
    const [todos, setTodos] = useState([
        { id: 1, text: 'Learn React', completed: true, createdAt: Date.now() - 100000 },
        { id: 2, text: 'Build a Todo App', completed: false, createdAt: Date.now() }
    ]);
    const [filter, setFilter] = useState('all'); // all, active, completed
    const [sortBy, setSortBy] = useState('date'); // date, status

    const addTodo = (text) => {
        const newTodo = {
            id: Date.now(),
            text,
            completed: false,
            createdAt: Date.now()
        };
        setTodos([newTodo, ...todos]); // Add to top
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    // Derived state logic
    const getFilteredAndSortedTodos = () => {
        let result = [...todos];

        // 1. Filter
        if (filter === 'active') {
            result = result.filter(todo => !todo.completed);
        } else if (filter === 'completed') {
            result = result.filter(todo => todo.completed);
        }

        // 2. Sort
        result.sort((a, b) => {
            if (sortBy === 'date') {
                return b.createdAt - a.createdAt; // Newest first
            } else if (sortBy === 'status') {
                // Uncompleted first
                return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
            }
            return 0;
        });

        return result;
    };

    const activeCount = todos.filter(t => !t.completed).length;

    return (
        <div className="todo-app">
            <header className="app-header">
                <h1>My Tasks</h1>
                <p className="task-count">
                    {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
                </p>
            </header>

            <div className="app-body">
                <TodoInput onAddTodo={addTodo} />

                <TodoFilter
                    currentFilter={filter}
                    onFilterChange={setFilter}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />

                <TodoList
                    todos={getFilteredAndSortedTodos()}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                />
            </div>
        </div>
    );
};

export default TodoApp;
