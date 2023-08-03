import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FormDetailsPage = () => {
  const { id } = useParams();
  const [formDetails, setFormDetails] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8081/form-details/${id}`)
      .then((response) => response.json())
      .then((data) => setFormDetails(data))
      .catch((error) => console.error("Error fetching form details:", error));
  }, [id]);

  if (!formDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Form Details Page</h1>
      <div className="card mb-4">
        <div className="card-body">
          <h2>{formDetails.form_name}</h2>
          <p>Status: {formDetails.form_status}</p>
          <p>Total Waiting Time: {formDetails.total_waiting_time}</p>
          <p>
            id {formDetails.id} Name {formDetails.name} Phone {formDetails.phone}
          </p>
          <p>Email {formDetails.email}</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h3>Actions</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>id</th>
                <th>Action</th>
                <th>Action start time</th>
                <th>Waiting time</th>
              </tr>
            </thead>
            <tbody>
              {formDetails.actions.map((action) => (
                <tr key={action.id}>
                  <td>{action.id}</td>
                  <td>{action.action}</td>
                  <td>{action.action_start_time}</td>
                  <td>{action.waiting_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FormDetailsPage;
