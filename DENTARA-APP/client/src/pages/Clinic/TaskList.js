import React from "react";
import "../../styles/ClinicDashboard.css";

const TaskList = () => {
  return (
    <div className="tasklist-container">
      {/* Top Row: Task Summary + Filters */}
      <div className="tasklist-top">
        <div className="task-summary">
          <h3>Today’s Task Summary</h3>
        </div>
        <div className="quick-filters">
          <h3>Quick Filters</h3>
          <button className="filter-btn">Apply Filter</button>
        </div>
      </div>

      {/* Middle: Task List */}
      <div className="task-list-section">
        <h3>Task List</h3>
        <button className="add-task-btn">+ Add New Task</button>
      </div>

      {/* Bottom: Notes & Comments */}
      <div className="notes-section">
        <h3>Notes & Comments</h3>
        <button className="save-note-btn">Save Note</button>
      </div>
    </div>
  );
};

export default TaskList;
