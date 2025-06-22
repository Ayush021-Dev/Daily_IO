import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./todo.css";

const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment 
  ? 'http://localhost:5000/api' 
  : 'https://daily-io-hgba.vercel.app/api';

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuthError = useCallback(() => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login', { state: { message: 'Your session has expired. Please log in again.' } });
  }, [navigate]);
  
  // Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        if (!token) {
          handleAuthError();
          return;
        }
        
        const res = await fetch(`${API_URL}/todos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.status === 401 || res.status === 403) {
          handleAuthError();
          return;
        }
        
        if (!res.ok) throw new Error('Failed to fetch todos');
        
        const data = await res.json();
        setTasks(data.map(todo => ({ id: todo._id, text: todo.text, completed: todo.completed })));
      } catch (err) {
        setError(err.message || 'Error loading todos');
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, [handleAuthError]);

  // Add a new todo
  const addTask = async () => {
    if (newTask.trim() === "") return;
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newTask })
      });
      if (res.status === 401 || res.status === 403) return handleAuthError();
      if (!res.ok) throw new Error('Failed to add todo');
      const todo = await res.json();
      setTasks([...tasks, { id: todo._id, text: todo.text, completed: todo.completed }]);
      setNewTask("");
    } catch (err) {
      setError(err.message || 'Error adding todo');
    }
  };

  // Toggle complete
  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (res.status === 401 || res.status === 403) return handleAuthError();
      if (!res.ok) throw new Error('Failed to update todo');
      const updated = await res.json();
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: updated.completed } : t));
    } catch (err) {
      setError(err.message || 'Error updating todo');
    }
  };

  // Delete a todo
  const deleteTask = async (id) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) return handleAuthError();
      if (!res.ok) throw new Error('Failed to delete todo');
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message || 'Error deleting todo');
    }
  };

  return (
    <div className="todo-page">
      <div className="todo-container">
        <div className="todo-card">
          <h2 className="todo-header">To-Do List</h2>
          {error && <div className="todo-error">{error}</div>}
          <input
            type="text"
            className="todo-input"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            disabled={loading}
          />
          <div className="todo-list">
            {loading ? (
              <div>Loading...</div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className={`todo-item ${task.completed ? "completed" : ""}`}>
                  <span onClick={() => toggleComplete(task.id)}>{task.text}</span>
                  <div className="todo-actions">
                    <button className="todo-complete-btn" onClick={() => toggleComplete(task.id)}>✓</button>
                    <button className="todo-delete-btn" onClick={() => deleteTask(task.id)}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDo;
