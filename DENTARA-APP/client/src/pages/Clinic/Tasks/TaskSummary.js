const TaskSummary = () => {
  return (
    <div className="tab-content task-summary-section">
      <h3>Today’s Summary</h3>

      <div className="summary-items">
        <div className="summary-card">Total Tasks: 12</div>
        <div className="summary-card">Urgent: 3</div>
        <div className="summary-card">Completed: 5</div>
        <div className="summary-card">Pending: 7</div>
      </div>
    </div>
  );
};

export default TaskSummary;
