import { useTodo } from '../context/TodoContext';
import TodoItem from './TodoItem';

const TodoList = () => {
    const { visibleTodos } = useTodo();

    if (visibleTodos.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p>No tasks found.</p>
            </div>
        );
    }

    return (
        <ul className="todo-list">
            {visibleTodos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                />
            ))}
        </ul>
    );
};

export default TodoList;
