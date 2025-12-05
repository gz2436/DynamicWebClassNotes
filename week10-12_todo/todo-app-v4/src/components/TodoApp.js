import { TodoProvider, useTodo } from '../context/TodoContext';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import TodoFilter from './TodoFilter';

const TodoAppContent = () => {
    const { activeCount } = useTodo();

    return (
        <div className="todo-app">
            <header className="app-header">
                <h1>My Tasks</h1>
                <p className="task-count">
                    {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
                </p>
            </header>

            <div className="app-body">
                <TodoInput />
                <TodoFilter />
                <TodoList />
            </div>
        </div>
    );
};

const TodoApp = () => {
    return (
        <TodoProvider>
            <TodoAppContent />
        </TodoProvider>
    );
};

export default TodoApp;
