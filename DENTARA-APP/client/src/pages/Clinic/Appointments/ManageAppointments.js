import React, { useState, useEffect, useRef } from "react";
import {
  updateAppointment,
  deleteAppointment,
  addNewAppointment,
} from "../../../services/appointmentsService";
import { listenToDoctors } from "../../../services/usersService";
import { getPatientsByDoctor } from "../../../services/patientsService";

const ManageAppointments = ({ appointment, onClose }) => {
  const isNew = !appointment || !appointment.id;
  const formRef = useRef(null);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const [form, setForm] = useState({
    doctorId: "",
    patientId: "",
    patientName: "",
    date: "",
    time: "",
    reason: "",
    room: "",
    status: "Pending",
  });

  // Fetch doctors 
  useEffect(() => {
    const unsubscribe = listenToDoctors((doctorsList) => {
      setDoctors(doctorsList);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!appointment) {
      // Reset form for new appointment
      setForm({
        doctorId: "",
        patientId: "",
        patientName: "",
        date: "",
        time: "",
        reason: "",
        room: "",
        status: "Pending",
      });
      setPatients([]);
    } else {
      // Load appointment data
      setForm({
        doctorId: appointment.doctorId || "",
        patientId: appointment.patientId || "",
        patientName: appointment.patientName || "",
        date: appointment.date || "",
        time: appointment.time || "",
        reason: appointment.reason || "",
        room: appointment.room || "",
        status: appointment.status || "Pending",
      });

      // Load patients for selected doctor
      if (appointment.doctorId) {
        loadPatientsForDoctor(appointment.doctorId);
      }
    }

    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, [appointment]);

  // Load patients when doctor is selected
  const loadPatientsForDoctor = async (doctorId) => {
    if (!doctorId) {
      setPatients([]);
      return;
    }

    try {
      setLoadingPatients(true);
      const patientsList = await getPatientsByDoctor(doctorId);
      setPatients(patientsList);
      setLoadingPatients(false);
    } catch (error) {
      console.error("Error loading patients:", error);
      setPatients([]);
      setLoadingPatients(false);
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // When doctor changes, load their patients
    if (field === "doctorId") {
      loadPatientsForDoctor(value);
      setForm((prev) => ({ ...prev, patientId: "", patientName: "" }));
    }

    // When patient changes, update patientName
    if (field === "patientId" && value) {
      const selectedPatient = patients.find((p) => p.id === value);
      if (selectedPatient) {
        setForm((prev) => ({
          ...prev,
          patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        }));
      }
    }
  };

  const handleSave = async () => {
    if (!form.doctorId || !form.patientId || !form.date || !form.time || !form.reason) {
      alert("Please fill in all required fields (Doctor, Patient, Date, Time, Reason)!");
      return;
    }

    try {
      if (isNew) {
        await addNewAppointment(form);
        alert("Appointment added successfully!");
      } else {
        await updateAppointment(appointment.id, form);
        alert("Appointment updated successfully!");
      }

      if (onClose) {
        onClose();
      } else {
        setForm({
          doctorId: "",
          patientId: "",
          patientName: "",
          date: "",
          time: "",
          reason: "",
          room: "",
          status: "Pending",
        });
        setPatients([]);
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to save appointment: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (isNew) return;
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await deleteAppointment(appointment.id);
      alert("Appointment deleted successfully!");
      if (onClose) onClose();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment");
    }
  };

  return (
    <div className="manage-box" ref={formRef}>
      <div className="manage-header">
        <h3>{isNew ? "➕ Add New Appointment" : "✏️ Edit Appointment"}</h3>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        )}
      </div>

      <div className="manage-form">
        <select
          value={form.doctorId}
          onChange={(e) => updateField("doctorId", e.target.value)}
          required
        >
          <option value="">Select Doctor *</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.fullName}
            </option>
          ))}
        </select>
        <select
          value={form.status}
          onChange={(e) => updateField("status", e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="No-Show">No-Show</option>
        </select>
        {!form.doctorId ? (
          <select disabled>
            <option>Select Doctor First</option>
          </select>
        ) : loadingPatients ? (
          <select disabled>
            <option>Loading Patients...</option>
          </select>
        ) : patients.length === 0 ? (
          <select disabled>
            <option>No Patients Found</option>
          </select>
        ) : (
          <select
            value={form.patientId}
            onChange={(e) => updateField("patientId", e.target.value)}
            required
          >
            <option value="">Select Patient *</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} ({patient.age} yrs)
              </option>
            ))}
          </select>
        )}
        <input
          type="date"
          value={form.date}
          onChange={(e) => updateField("date", e.target.value)}
          required
        />

        <input
          type="time"
          value={form.time}
          onChange={(e) => updateField("time", e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Room (e.g., Room 1)"
          value={form.room}
          onChange={(e) => updateField("room", e.target.value)}
        />

        <input
          type="text"
          placeholder="Reason for Visit (e.g., Cleaning, Filling, Root Canal) *"
          value={form.reason}
          onChange={(e) => updateField("reason", e.target.value)}
          required
        />
      </div>

      <div className="manage-actions">
        <button className="save-btn" onClick={handleSave}>
          💾 {isNew ? "Add Appointment" : "Save Changes"}
        </button>

        {!isNew && (
          <button className="delete-btn" onClick={handleDelete}>
            🗑 Delete Appointment
          </button>
        )}
      </div>
    </div>
  );
};

export default ManageAppointments;
