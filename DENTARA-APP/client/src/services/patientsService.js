import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

//  trying to get all patients checki to their ids
export const listenToAllPatients = (callback) => {
  return onSnapshot(collection(db, "patients"), (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });
};

//  GET ALL PATIENTS
export const getAllPatients = async () => {
  const patientsSnapshot = await getDocs(collection(db, "patients"));
  return patientsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// by id
export const getPatientById = async (patientId) => {
  const patientDoc = await getDoc(doc(db, "patients", patientId));
  if (patientDoc.exists()) {
    return { id: patientDoc.id, ...patientDoc.data() };
  }
  return null;
};


export const getPatientsByDoctor = async (doctorId) => {
  // Get all appointments for this doctor
  const q = query(
    collection(db, "appointments"),
    where("doctorId", "==", doctorId)
  );
  const appointmentsSnapshot = await getDocs(q);
  
  // Get unique patient IDs
  const patientIds = [...new Set(
    appointmentsSnapshot.docs.map(doc => doc.data().patientId).filter(Boolean)
  )];
  
  //  patient details
  const patients = await Promise.all(
    patientIds.map(id => getPatientById(id))
  );
  
  return patients.filter(Boolean); // Remove nulls
};

// add new patient
export const addNewPatient = async (data) => {
  return addDoc(collection(db, "patients"), {
    ...data,
    createdAt: new Date().toISOString(),
  });
};

// UPDATE PATIENT
export const updatePatient = async (id, data) => {
  return updateDoc(doc(db, "patients", id), data);
};

// DELETE PATIENT
export const deletePatient = async (id) => {
  return deleteDoc(doc(db, "patients", id));
};
