const todoReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            const newTodo = {
                id: Date.now(),
                text: action.payload,
                completed: false,
                createdAt: Date.now()
            };
            return {
                ...state,
                todos: [newTodo, ...state.todos]
            };

        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            };

        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload)
            };

        case 'SET_FILTER':
            return {
                ...state,
                filter: action.payload
            };

        case 'SET_SORT':
            return {
                ...state,
                sortBy: action.payload
            };

        default:
            return state;
    }
};

export default todoReducer;
