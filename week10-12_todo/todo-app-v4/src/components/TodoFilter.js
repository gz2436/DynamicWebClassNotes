import { useTodo } from '../context/TodoContext';

const TodoFilter = () => {
    const { filter, sortBy, dispatch } = useTodo();

    return (
        <div className="todo-controls">
            <div className="filter-group">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}
                >
                    All
                </button>
                <button
                    className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}
                >
                    Active
                </button>
                <button
                    className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}
                >
                    Completed
                </button>
            </div>

            <div className="sort-group">
                <span className="sort-label">Sort by:</span>
                <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => dispatch({ type: 'SET_SORT', payload: e.target.value })}
                >
                    <option value="date">Date Created</option>
                    <option value="status">Status</option>
                </select>
            </div>
        </div>
    );
};

export default TodoFilter;
