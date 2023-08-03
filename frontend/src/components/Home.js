import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [forms, setForms] = useState([]);
  const [selectedForms, setSelectedForms] = useState([]);
  const [deleteEnabled, setDeleteEnabled] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = () => {
    fetch("http://localhost:8081/forms")
      .then((response) => response.json())
      .then((data) => setForms(data))
      .catch((error) => console.error("Error fetching forms:", error));
  };

  const handleDelete = (formId) => {
    fetch(`http://localhost:8081/forms/${formId}`, {
      method: "DELETE",
    })
      .then(() => {
        setForms(forms.filter((form) => form.id !== formId));
      })
      .catch((error) => console.error("Error deleting form:", error));
  };

  const handleCheckboxChange = (formId) => {
    if (selectedForms.includes(formId)) {
      setSelectedForms(selectedForms.filter((id) => id !== formId));
    } else {
      setSelectedForms([...selectedForms, formId]);
    }
  };

  const handleDeleteSelected = () => {
    Promise.all(selectedForms.map((formId) => handleDelete(formId))).then(() => {
      setSelectedForms([]);
      setDeleteEnabled(false);
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Forms</h1>
      <button className="btn btn-danger" onClick={handleDeleteSelected} disabled={!deleteEnabled}>
        Delete Selected
      </button>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Form Name</th>
            <th>Form Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={form.id}>
              <input
                className="mt-3"
                type="checkbox"
                checked={selectedForms.includes(form.id)}
                onChange={() => handleCheckboxChange(form.id)}
              />
              <td>{form.id}</td>
              <td>{form.name}</td>
              <td>{form.email}</td>
              <td>{form.phone}</td>
              <td>{form.form_name}</td>
              <td>{form.form_status}</td>
              <td>
                <button className="btn btn-danger mr-2" onClick={() => handleDelete(form.id)}>
                  Delete
                </button>
                <Link to={`/form-details/${form.id}`} className="btn btn-primary">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomePage;
