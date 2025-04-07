import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await axios.post(API_URL, { text: newTask });
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const updateTask = async (id, completed) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTasks(tasks.map(task => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter a new task"
      />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <span
              style={{ textDecoration: task.completed ? "line-through" : "none" }}
            >
              {task.text}
            </span>
            <button onClick={() => updateTask(task._id, task.completed)}>
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
