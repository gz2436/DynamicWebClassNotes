# V1 vs V4 Comparison - Visual Guide

## Quick Comparison Table

| Feature | V1 (Basic) | V4 (Context + useReducer) |
|---------|------------|---------------------------|
| **State Management** | `useState` | `useReducer` |
| **Global State** | ❌ Props drilling | ✅ Context API |
| **Data Flow** | Parent → Child via props | Context Provider → Any component |
| **Complexity** | Simple but repetitive | Centralized and scalable |
| **Persistence** | ❌ None | ✅ LocalStorage |
| **Filtering** | Basic | Advanced (All/Active/Completed) |

---

## File Structure Comparison

### V1 Structure
```
todo-app-v1/
├── src/
│   ├── components/
│   │   ├── TodoForm.js        (receives setState via props)
│   │   ├── TodoList.js        (receives todos + handlers via props)
│   │   └── TodoItem.js        (receives handlers via props)
│   ├── App.js                 (manages ALL state with useState)
│   └── index.js
```

### V4 Structure
```
todo-app-v4/
├── src/
│   ├── context/
│   │   ├── TodoContext.js     (✨ NEW: Global state provider)
│   │   └── TodoReducer.js     (✨ NEW: State logic)
│   ├── components/
│   │   ├── TodoForm.js        (uses useContext directly)
│   │   ├── TodoList.js        (uses useContext directly)
│   │   ├── TodoItem.js        (uses useContext directly)
│   │   └── FilterButtons.js   (✨ NEW: Filter functionality)
│   ├── App.js                 (clean - only renders components)
│   └── index.js               (wraps with TodoProvider)
```

---

## Code Pattern Differences

### How Components Access State

#### V1 - Prop Drilling Pattern
```javascript
// App.js - All state lives here
function App() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };
  
  return (
    <div>
      <TodoForm addTodo={addTodo} />              {/* Pass down ❌ */}
      <TodoList todos={todos} setTodos={setTodos} /> {/* Pass down ❌ */}
    </div>
  );
}

// TodoForm.js - Receives as props
function TodoForm({ addTodo }) {  // Must receive from parent ❌
  // ...
  const handleSubmit = () => {
    addTodo(input);
  };
}
```

#### V4 - Context Pattern
```javascript
// App.js - Clean and simple
function App() {
  return (
    <div>
      <TodoForm />      {/* No props! ✅ */}
      <TodoList />      {/* No props! ✅ */}
      <FilterButtons /> {/* No props! ✅ */}
    </div>
  );
}

// TodoForm.js - Direct access to context
function TodoForm() {
  const { dispatch } = useContext(TodoContext); // Direct access ✅
  
  const handleSubmit = () => {
    dispatch({ type: 'ADD_TODO', payload: input });
  };
}
```

---

## State Management Logic

### V1 - Multiple useState calls
```javascript
const [todos, setTodos] = useState([]);
const [filter, setFilter] = useState('all');
const [input, setInput] = useState('');

// Scattered update logic
const addTodo = (text) => {
  setTodos([...todos, newTodo]);
};

const deleteTodo = (id) => {
  setTodos(todos.filter(todo => todo.id !== id));
};
```

### V4 - Centralized useReducer
```javascript
// TodoReducer.js - All logic in one place
export const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload]
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
    default:
      return state;
  }
};
```

---

## Visual Demonstration

### Running the Apps Side-by-Side

**Terminal 1 - V1:**
```bash
cd week10/todo-app-v1
npm start
# Opens on http://localhost:3000
```

**Terminal 2 - V4:**
```bash
cd week10/todo-app-v4
PORT=3001 npm start
# Opens on http://localhost:3001
```

Then compare:
1. **Functionality**: V4 has filtering, V1 doesn't
2. **Persistence**: Refresh V4 - data persists; Refresh V1 - data lost
3. **Code**: Open DevTools → Components → See Context in V4

---

## Key Takeaways

### When to use V1 pattern (useState):
- ✅ Simple, small components
- ✅ State used by 1-2 components
- ✅ Quick prototypes

### When to use V4 pattern (Context + useReducer):
- ✅ Complex state logic
- ✅ Many components need same state
- ✅ Avoiding deep prop drilling
- ✅ Application-wide state management

---

## Quick Visual Check

Open both apps and:

**V1 Limitations:**
- ❌ No filter buttons visible
- ❌ Refresh = lose all data
- ❌ Simple UI

**V4 Features:**
- ✅ Filter buttons (All/Active/Completed)
- ✅ Refresh = data remains
- ✅ NYU Violet theme
- ✅ Better organized code
