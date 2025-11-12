import React, { useState } from "react";
import "../../styles/ClinicDashboard.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([
    "Check patient records",
    "Follow up on missed check-ins",
    "Send reminder messages",
  ]);

  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  return (
    <div className="clinic-page">
      <h2>Daily Tasks</h2>

      <div className="task-input">
        <input
          type="text"
          placeholder="Add new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
