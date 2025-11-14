import React, { useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { uploadClinicData } from "../../../services/dataService";

export default function DataCenter() {
  const { token } = useContext(AuthContext); // Get manager auth token
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setMsg("Please choose a file");

    setLoading(true);
    setMsg("");

    try {
      // Call the service function to upload data
      const result = await uploadClinicData(file, title, token);
      console.log("Upload result:", result);
      setMsg("Uploaded successfully!");
      setFile(null);
      setTitle("");
    } catch (error) {
      setMsg(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 500, margin: "0 auto" }}>
      <h3>Data Center — Upload Clinic Data</h3>

      <label htmlFor="title">Report Title</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Enter report title"
      />

      <label htmlFor="file">CSV / Excel file</label>
      <input
        id="file"
        type="file"
        accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {msg && <div style={{ marginTop: 10 }}>{msg}</div>}
    </form>
  );
}
