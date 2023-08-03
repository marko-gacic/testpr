import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const initialFormValues = {
    email: "",
    password: "",
  };

  const [values, setValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const redirect = () => {
    window.location.href = "/home";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:8081/login", values);
        console.log("Login successful:", response.data);
        redirect();
      } catch (error) {
        console.error("Error logging in:", error);
      }
    }
  };

  const validateForm = (values) => {
    let errors = {};
    const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{10,16}$/;

    if (values.email.trim() === "") {
      errors.email = "Email is required";
    } else if (!email_pattern.test(values.email)) {
      errors.email = "Invalid email";
    }

    if (values.password.trim() === "") {
      errors.password = "Password is required";
    } else if (values.password.length < 10) {
      errors.password = "Password must be at least 10 characters";
    } else if (!password_pattern.test(values.password)) {
      errors.password = "Incorrect Password.";
    }

    return errors;
  };

  return (
    <div className="d-flex justify-content-center align-items-center  vh-100">
      <div className="bg-faded p-3 rounded w-25 shadow border ">
        <h2 className="">Login</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              className={`form-control rounded-3 border-primary ${
                errors.email ? "is-invalid" : ""
              }`}
              type="email"
              placeholder="Enter Your Email"
              value={values.email}
              onChange={handleInput}
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              className={`form-control rounded-3 border-primary ${
                errors.password ? "is-invalid" : ""
              }`}
              type="password"
              placeholder="Enter Your Password"
              value={values.password}
              onChange={handleInput}
            />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Login
          </button>
          <Link
            to="/register"
            type="button"
            className="btn btn-default border w-100 bg-light  text-decoration-none ">
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
