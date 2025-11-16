import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

const db = getFirestore();

// Listen to all appointments in real-time
export const listenToAllAppointments = (callback) => {
  const appointmentsRef = collection(db, "appointments");
  const unsubscribe = onSnapshot(appointmentsRef, (snapshot) => {
    const appointmentsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(appointmentsList);
  });
  return unsubscribe;
};

// Get appointments for a specific doctor
export const getAppointmentsByDoctor = async (doctorId) => {
  const appointmentsRef = collection(db, "appointments");
  const q = query(appointmentsRef, where("doctorId", "==", doctorId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get appointments for a specific patient
export const getAppointmentsByPatient = async (patientId) => {
  const appointmentsRef = collection(db, "appointments");
  const q = query(appointmentsRef, where("patientId", "==", patientId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Add new appointment
export const addNewAppointment = async (appointmentData) => {
  try {
    const appointmentsRef = collection(db, "appointments");
    const docRef = await addDoc(appointmentsRef, {
      ...appointmentData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding appointment:", error);
    throw error;
  }
};

// Update existing appointment
export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId);
    await updateDoc(appointmentRef, {
      ...appointmentData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

// Delete appointment
export const deleteAppointment = async (appointmentId) => {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId);
    await deleteDoc(appointmentRef);
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};

// Listen to check-in/cancellations/no-shows
export const listenToCheckinCancellations = (callback) => {
  const appointmentsRef = collection(db, "appointments");
  const unsubscribe = onSnapshot(appointmentsRef, (snapshot) => {
    const checkinList = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (apt) =>
          apt.status === "In Progress" ||
          apt.status === "Cancelled" ||
          apt.status === "No-Show"
      );
    callback(checkinList);
  });
  return unsubscribe;
};

// NEW: Fix missing doctor names - populate doctorName for all appointments
export const fixMissingDoctorNames = async () => {
  try {
    console.log("🔧 Starting to fix missing doctor names...");

    // Get all appointments
    const appointmentsRef = collection(db, "appointments");
    const appointmentsSnap = await getDocs(appointmentsRef);

    // Get all users
    const usersRef = collection(db, "users");
    const usersSnap = await getDocs(usersRef);

    // Create a map of doctor ID -> doctor name
    const doctorMap = {};
    usersSnap.docs.forEach((doc) => {
      const user = doc.data();
      if (user.role === "doctor") {
        const fullName = user.fullName || `${user.firstName} ${user.lastName}`;
        doctorMap[doc.id] = fullName;
      }
    });

    console.log("Doctor Map:", doctorMap);

    // Update appointments that are missing doctorName
    let updatedCount = 0;
    const updatePromises = [];

    appointmentsSnap.docs.forEach((doc) => {
      const apt = doc.data();

      // If missing doctorName and has doctorId and doctor exists in map
      if (!apt.doctorName && apt.doctorId && doctorMap[apt.doctorId]) {
        const updatePromise = updateDoc(doc.ref, {
          doctorName: doctorMap[apt.doctorId],
        });
        updatePromises.push(updatePromise);
        updatedCount++;
        console.log(
          `✅ Will update: ${apt.patientName} - Doctor: ${doctorMap[apt.doctorId]}`
        );
      }
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    console.log(`✅ Successfully updated ${updatedCount} appointments`);
    return updatedCount;
  } catch (error) {
    console.error("Error fixing doctor names:", error);
    throw error;
  }
};
