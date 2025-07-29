
import React, { useState, useEffect } from 'react';

const api = 'http://localhost:4000';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const login = async () => {
    const res = await fetch(api + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) setToken(data.token);
    else alert('Invalid credentials');
  };

  const fetchTodos = async () => {
    const res = await fetch(api + '/items', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    await fetch(api + '/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTodo }),
    });
    setNewTodo('');
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(api + '/items/' + id, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTodos();
  };

  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  if (!token)
    return (
      <div>
        <h2>Login</h2>
        <input data-cy="email" placeholder="email" onChange={e => setEmail(e.target.value)} />
        <input data-cy="password" type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
        <button data-cy="login" onClick={login}>Login</button>
      </div>
    );

  return (
    <div>
      <h2>Your Todos</h2>
      <input data-cy="new-todo" value={newTodo} onChange={e => setNewTodo(e.target.value)} />
      <button data-cy="add-button" onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title}
            <button data-cy="delete-button" onClick={() => deleteTodo(todo.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
