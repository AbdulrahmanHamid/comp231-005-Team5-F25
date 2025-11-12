import React from "react";

const TaskList = () => {
  const tasks = [
    { id: 1, task: "Call Patient John", status: "Pending" },
    { id: 2, task: "Upload Reports", status: "Completed" },
  ];

  return (
    <div className="tab-content">
      <h3>Task List</h3>
      <button className="green-btn">+ Add New Task</button>

      <table className="module-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td>{t.task}</td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
