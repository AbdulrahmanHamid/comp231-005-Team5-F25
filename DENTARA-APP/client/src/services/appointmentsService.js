import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

// 🔵 LISTEN TO ALL APPOINTMENTS
export const listenToAllAppointments = (callback) => {
  const q = query(collection(db, "appointments"));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });
};

// 🔵 LISTEN TO TODAY CHECK-IN/CANCEL/NO-SHOW
export const listenToCheckinCancellations = (callback) => {
  const today = new Date().toISOString().split("T")[0];

  const q = query(
    collection(db, "appointments"),
    where("date", "==", today),
    where("status", "in", ["checked-in", "cancelled", "no-show"])
  );

  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });
};

// 🔵 UPDATE STATUS
export const updateAppointmentStatus = async (appointmentId, newStatus) => {
  const ref = doc(db, "appointments", appointmentId);
  await updateDoc(ref, { status: newStatus });
};

// 🔵 ADD NEW APPOINTMENT
export const addNewAppointment = (data) => {
  // check if patientId exists
  if (!data.patientId) {
    throw new Error("patientId is required");
  }
  
  return addDoc(collection(db, "appointments"), {
    ...data,
    status: data.status || "Pending",
    createdAt: new Date().toISOString(),
  });
};

// 🔵 UPDATE AN APPOINTMENT
export const updateAppointment = (id, data) => {
  return updateDoc(doc(db, "appointments", id), data);
};

// 🔵 DELETE AN APPOINTMENT
export const deleteAppointment = (id) => {
  return deleteDoc(doc(db, "appointments", id));
};
