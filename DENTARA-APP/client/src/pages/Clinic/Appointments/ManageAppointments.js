import React, { useState, useEffect, useRef } from "react";
import { updateAppointment, deleteAppointment, addNewAppointment } from "../../../services/appointmentsService";
import { listenToDoctors } from "../../../services/usersService";
import { listenToAllPatients } from "../../../services/patientsService";
import "../../../styles/ClinicDashboard.css";

const ManageAppointments = ({ appointment, onClose }) => {
  const isNew = !appointment?.id;
  const formRef = useRef(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [form, setForm] = useState({
    doctorId: "", patientId: "", date: "", time: "", reason: "", room: "", status: "Pending",
  });

  useEffect(() => {
    listenToDoctors(setDoctors);
    listenToAllPatients((list) => {
      if (appointment?.doctorId) {
        setPatients(list.filter((p) => p.doctorId === appointment.doctorId));
      }
    });
  }, []);

  useEffect(() => {
    if (!appointment) {
      setForm({ doctorId: "", patientId: "", date: "", time: "", reason: "", room: "", status: "Pending" });
    } else {
      setForm({
        doctorId: appointment.doctorId || "",
        patientId: appointment.patientId || "",
        date: appointment.date || "",
        time: appointment.time || "",
        reason: appointment.reason || "",
        room: appointment.room || "",
        status: appointment.status || "Pending",
      });
    }
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [appointment]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "doctorId") {
      setLoadingPatients(true);
      const doctorPatients = doctors.find((d) => d.id === value);
      setPatients(doctors.filter((d) => d.id === value).length > 0 ? [] : []);
      setLoadingPatients(false);
    }
  };

  const handleSave = async () => {
    if (!form.doctorId || !form.patientId || !form.date || !form.time || !form.reason) {
      alert("Fill all required fields!");
      return;
    }
    try {
      const selectedDoctor = doctors.find((d) => d.id === form.doctorId);
      const selectedPatient = patients.find((p) => p.id === form.patientId);
      const data = {
        ...form,
        doctorName: selectedDoctor?.fullName,
        patientName: `${selectedPatient?.firstName} ${selectedPatient?.lastName}`,
        patientAge: selectedPatient?.age,
        patientPhone: selectedPatient?.phone,
        status: isNew ? "Pending" : form.status,
      };
      isNew ? await addNewAppointment(data) : await updateAppointment(appointment.id, data);
      alert("✅ Appointment " + (isNew ? "added" : "updated") + "!");
      onClose?.();
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await deleteAppointment(appointment.id);
      alert("✅ Deleted!");
      onClose?.();
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <div className="manage-box" ref={formRef}>
      <div className="manage-header">
        <h3>{isNew ? "➕ Add Appointment" : "✏️ Edit Appointment"}</h3>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
      <div className="manage-form">
        <select value={form.doctorId} onChange={(e) => updateField("doctorId", e.target.value)} required className="form-input">
          <option value="">Select Doctor *</option>
          {doctors.map((d) => <option key={d.id} value={d.id}>{d.fullName}</option>)}
        </select>
        <select value={form.patientId} onChange={(e) => updateField("patientId", e.target.value)} required className="form-input" disabled={!form.doctorId || loadingPatients}>
          <option value="">{!form.doctorId ? "Select Doctor First" : "Select Patient *"}</option>
          {patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.age} yrs)</option>)}
        </select>
        <input type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)} required className="form-input" />
        <input type="time" value={form.time} onChange={(e) => updateField("time", e.target.value)} required className="form-input" />
        <input type="text" placeholder="Reason *" value={form.reason} onChange={(e) => updateField("reason", e.target.value)} required className="form-input" />
        <input type="text" placeholder="Room" value={form.room} onChange={(e) => updateField("room", e.target.value)} className="form-input" />
        {!isNew && (
          <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className="form-input">
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Checked-in</option>
            <option>Completed</option>
            <option>Cancelled</option>
            <option>No-Show</option>
          </select>
        )}
      </div>
      <div className="manage-actions">
        <button className="save-btn" onClick={handleSave}>💾 {isNew ? "Add" : "Save"}</button>
        {!isNew && <button className="delete-btn" onClick={handleDelete}>🗑 Delete</button>}
      </div>
    </div>
  );
};

export default ManageAppointments;
