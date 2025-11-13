import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { listenToTasks } from "../../../services/tasksService";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsub = listenToTasks((list) => setTasks(list));
    return () => unsub();
  }, []);

  return (
    <div>
      <h2>Tasks</h2>

      <div className="subnav-buttons">
        <NavLink to="summary" className="subnav-btn">Task Summary</NavLink>
        <NavLink to="list" className="subnav-btn">Task List</NavLink>
      </div>

      {/* Pass tasks to child pages */}
      <Outlet context={{ tasks }} />
    </div>
  );
};

export default TasksPage;
