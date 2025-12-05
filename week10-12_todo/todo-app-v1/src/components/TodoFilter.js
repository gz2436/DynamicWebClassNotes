const TodoFilter = ({ currentFilter, onFilterChange, sortBy, onSortChange }) => {
    return (
        <div className="todo-controls">
            <div className="filter-group">
                <button
                    className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
                    onClick={() => onFilterChange('all')}
                >
                    All
                </button>
                <button
                    className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
                    onClick={() => onFilterChange('active')}
                >
                    Active
                </button>
                <button
                    className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
                    onClick={() => onFilterChange('completed')}
                >
                    Completed
                </button>
            </div>

            <div className="sort-group">
                <span className="sort-label">Sort by:</span>
                <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    <option value="date">Date Created</option>
                    <option value="status">Status</option>
                </select>
            </div>
        </div>
    );
};

export default TodoFilter;
