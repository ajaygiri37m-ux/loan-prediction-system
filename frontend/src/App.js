import React, { useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [formData, setFormData] = useState({
    Gender: "",
    Married: "",
    Dependents: "",
    Education: "",
    Self_Employed: "",
    ApplicantIncome: "",
    CoapplicantIncome: "",
    LoanAmount: "",
    Loan_Amount_Term: "",
    Credit_History: "",
    Property_Area: ""
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in formData) {
      if (!formData[key]) {
        alert("Please fill all fields");
        return;
      }
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData
      );

      const p = res.data.probability || [0, 0];

      const text = res.data.approved
        ? `Loan Approved ✅ (${(p[1] * 100).toFixed(2)}%)`
        : `Loan Rejected ❌ (${(p[0] * 100).toFixed(2)}%)`;

      setResult(text);
    } catch (err) {
      setResult("Server Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>🏦 Loan Prediction System</h2>

        <form onSubmit={handleSubmit}>

          <select name="Gender" onChange={handleChange}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select name="Married" onChange={handleChange}>
            <option value="">Married</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <input name="Dependents" placeholder="Dependents" onChange={handleChange} />

          <select name="Education" onChange={handleChange}>
            <option value="">Education</option>
            <option value="Graduate">Graduate</option>
            <option value="Not Graduate">Not Graduate</option>
          </select>

          <select name="Self_Employed" onChange={handleChange}>
            <option value="">Self Employed</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <input name="ApplicantIncome" placeholder="Applicant Income" onChange={handleChange} />
          <input name="CoapplicantIncome" placeholder="Coapplicant Income" onChange={handleChange} />
          <input name="LoanAmount" placeholder="Loan Amount" onChange={handleChange} />
          <input name="Loan_Amount_Term" placeholder="Loan Term" onChange={handleChange} />

          <select name="Credit_History" onChange={handleChange}>
            <option value="">Credit History</option>
            <option value="1">Good (1)</option>
            <option value="0">Bad (0)</option>
          </select>

          <select name="Property_Area" onChange={handleChange}>
            <option value="">Property Area</option>
            <option value="Urban">Urban</option>
            <option value="Semiurban">Semiurban</option>
            <option value="Rural">Rural</option>
          </select>

          <button type="submit">
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>

        {result && (
          <div className={`result ${result.includes("Approved") ? "success" : "fail"}`}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}