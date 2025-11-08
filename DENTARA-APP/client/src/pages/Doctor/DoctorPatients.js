// export default DoctorPatients;
import React from "react";
import { Routes, Route } from "react-router-dom";
import DoctorPatientsList from "./DoctorPatientsList";
import DoctorPatientDetails from "./DoctorPatientDetails";

const DoctorPatients = () => {
  return (
    <Routes>
      {/* Default patients list */}
      <Route path="/" element={<DoctorPatientsList />} />

      {/* Dynamic patient details */}
      <Route path=":patientId" element={<DoctorPatientDetails />} />
    </Routes>
  );
};

export default DoctorPatients;