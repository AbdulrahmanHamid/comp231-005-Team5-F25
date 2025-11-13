import React, { useState, useEffect } from "react";
import {
  updateAppointment,
  deleteAppointment,
  addNewAppointment,
} from "../../../services/appointmentsService";

const ManageAppointments = ({ appointment, doctors }) => {
  const isNew = !appointment || !appointment.id;

  const [form, setForm] = useState({
    patientName: "",
    date: "",
    time: "",
    doctorId: "",
    reason: "",
    room: "",
  });

  useEffect(() => {
    if (!appointment) {
      setForm({
        patientName: "",
        date: "",
        time: "",
        doctorId: "",
        reason: "",
        room: "",
      });
    } else {
      setForm({
        patientName: appointment.patientName || "",
        date: appointment.date || "",
        time: appointment.time || "",
        doctorId: appointment.doctorId || "",
        reason: appointment.reason || "",
        room: appointment.room || "",
      });
    }
  }, [appointment]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.patientName || !form.date || !form.time) {
      alert("Please fill required fields!");
      return;
    }

    if (isNew) await addNewAppointment(form);
    else await updateAppointment(appointment.id, form);

    alert(isNew ? "Appointment added!" : "Appointment updated!");
  };

  const handleDelete = async () => {
    if (isNew) return;
    if (!window.confirm("Delete this appointment?")) return;
    await deleteAppointment(appointment.id);
  };

  return (
    <div className="manage-box">
      <h3>{isNew ? "Add Appointment" : "Edit Appointment"}</h3>

      <div className="manage-form">
        <input
          placeholder="Patient Name"
          value={form.patientName}
          onChange={(e) => updateField("patientName", e.target.value)}
        />

        <input type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)} />

        <input type="time" value={form.time} onChange={(e) => updateField("time", e.target.value)} />

        {/* Doctor Dropdown */}
        <select value={form.doctorId} onChange={(e) => updateField("doctorId", e.target.value)}>
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.fullName}
            </option>
          ))}
        </select>

        <input
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => updateField("reason", e.target.value)}
        />

        <input
          placeholder="Room"
          value={form.room}
          onChange={(e) => updateField("room", e.target.value)}
        />
      </div>

      <button className="save-btn" onClick={handleSave}>
        💾 {isNew ? "Add Appointment" : "Save Changes"}
      </button>

      {!isNew && (
        <button className="delete-btn" onClick={handleDelete}>
          🗑 Delete Appointment
        </button>
      )}
    </div>
  );
};

export default ManageAppointments;
