// import React, { useState, useContext } from "react";
// import { AuthContext } from "../../../contexts/AuthContext";
// import { uploadClinicData } from "../../../services/dataService";

// export default function DataCenter() {
//   const { token } = useContext(AuthContext);

//   const [file, setFile] = useState(null);
//   const [title, setTitle] = useState("");
//   const [msg, setMsg] = useState("");
//   const [msgType, setMsgType] = useState("info"); // success | error | info
//   const [loading, setLoading] = useState(false);

//   const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

//   // Handle file selection with validation
//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     if (!selected) return;

//     const validTypes = [
//       "text/csv",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     ];

//     if (!validTypes.includes(selected.type)) {
//       setMsgType("error");
//       setMsg("Invalid file type. Please upload a CSV or Excel file.");
//       setFile(null);
//       return;
//     }

//     if (selected.size > MAX_SIZE) {
//       setMsgType("error");
//       setMsg("File too large. Max size is 5 MB.");
//       setFile(null);
//       return;
//     }

//     setMsg("");
//     setMsgType("info");
//     setFile(selected);
//   };

//   // Reset form
//   const clearForm = () => {
//     setFile(null);
//     setTitle("");
//     setMsg("");
//     setMsgType("info");
//   };

//   // Handle upload
//   const submit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setMsgType("error");
//       return setMsg("Please choose a valid file first.");
//     }

//     setLoading(true);
//     setMsg("");
//     setMsgType("info");

//     try {
//       const result = await uploadClinicData(file, title, token);
//       console.log("Upload result:", result);

//       setMsgType("success");
//       setMsg("Uploaded successfully!");
//       clearForm();
//     } catch (error) {
//       setMsgType("error");
//       setMsg(`Upload failed: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={submit} style={{ maxWidth: 500, margin: "0 auto" }}>
//       <h3>Data Center — Upload Clinic Data</h3>

//       <label htmlFor="title">Report Title</label>
//       <input
//         id="title"
//         type="text"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         required
//         placeholder="Enter report title"
//       />

//       <label htmlFor="file">CSV / Excel file</label>
//       <input
//         id="file"
//         type="file"
//         accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         onChange={handleFileChange}
//       />

//       {file && (
//         <div style={{ marginTop: 8, fontSize: 14 }}>
//           <strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)
//         </div>
//       )}

//       <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
//         {loading ? "Uploading..." : "Upload"}
//       </button>

//       {file && (
//         <button
//           type="button"
//           onClick={clearForm}
//           style={{ marginLeft: 10 }}
//           disabled={loading}
//         >
//           Clear
//         </button>
//       )}

//       {msg && (
//         <div
//           style={{
//             marginTop: 15,
//             padding: "8px 10px",
//             borderRadius: 5,
//             color:
//               msgType === "error"
//                 ? "#b00020"
//                 : msgType === "success"
//                 ? "#0a7a0a"
//                 : "#333",
//             background:
//               msgType === "error"
//                 ? "#fdd"
//                 : msgType === "success"
//                 ? "#e2ffe2"
//                 : "#f4f4f4"
//           }}
//         >
//           {msg}
//         </div>
//       )}
//     </form>
//   );
// }
