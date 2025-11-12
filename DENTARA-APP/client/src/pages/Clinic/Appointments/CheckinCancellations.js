import React from "react";

const CheckinCancellations = () => {
  const stats = {
    total: 25,
    checkedIn: 12,
    cancelled: 3,
    pending: 10,
  };

  return (
    <div className="tab-content">
      <div className="filters">
        <select><option>Filter by Date</option></select>
        <select><option>Doctor</option></select>
        <select><option>Status</option></select>
      </div>

      <div className="checkin-layout">
        <div className="table-area">
          <table className="module-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr><td>John Doe</td><td>Dr. White</td><td>9:00 AM</td><td>Checked-in</td></tr>
              <tr><td>Sarah Lee</td><td>Dr. Brown</td><td>10:00 AM</td><td>Pending</td></tr>
            </tbody>
          </table>

          <button className="load-btn">Load More</button>
        </div>

        <div className="stats-box">
          <h3>QUICK STATS</h3>
          <p>Total Appointments: {stats.total}</p>
          <p>Checked-in: {stats.checkedIn}</p>
          <p>Cancelled: {stats.cancelled}</p>
          <p>Pending: {stats.pending}</p>

          <div className="fake-chart"></div>
        </div>
      </div>
    </div>
  );
};

export default CheckinCancellations;
