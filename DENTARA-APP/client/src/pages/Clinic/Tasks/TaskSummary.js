import React from "react";
import { useOutletContext } from "react-router-dom";

const TaskSummary = () => {
  const { tasks = [] } = useOutletContext(); // 🔥 gets real-time tasks

  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "Pending").length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const highPriority = tasks.filter(t => t.priority === "High").length;

  return (
    <div className="tab-content task-summary-section">
      <h3>Today’s Task Summary</h3>

      <div className="summary-items">
        <div className="summary-card">Total: {total}</div>
        <div className="summary-card pending">Pending: {pending}</div>
        <div className="summary-card completed">Completed: {completed}</div>
        <div className="summary-card high">High Priority: {highPriority}</div>
      </div>

      <div className="summary-progress">
        <div 
          className="bar" 
          style={{ width: `${total ? (completed/total)*100 : 0}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TaskSummary;
