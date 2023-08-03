import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const redirect = () => {
    window.location.href = "/";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:8081/register", values);
        console.log("Registration successful:", response.data);
        redirect();
      } catch (error) {
        console.error("Error registering:", error);
      }
    }
  };

  const validateForm = (values) => {
    let errors = {};
    const email_pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{10,16}$/;

    if (values.username.trim() === "") {
      errors.username = "Username is required";
    } else if (values.username.length < 3 || values.username.length > 20) {
      errors.username = "Username must be between 3 and 20 characters";
    }

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
      errors.password =
        "Invalid password. It must contain at least one uppercase letter, one lowercase letter, and one digit.";
    }

    if (values.confirmPassword.trim() === "") {
      errors.confirmPassword = "Confirm password is required";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  return (
    <div className="d-flex justify-content-center align-items-center  vh-100">
      <div className="bg-faded p-3 rounded w-25 shadow border ">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username">User Name</label>
            <input
              className={`form-control rounded-3 border-primary ${
                errors.username ? "is-invalid" : ""
              }`}
              autoComplete="username"
              type="text"
              name="username"
              value={values.username}
              placeholder="Enter Username"
              onChange={handleChange}
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              className={`form-control rounded-3 border-primary ${
                errors.email ? "is-invalid" : ""
              }`}
              autoComplete="email"
              type="email"
              name="email"
              value={values.email}
              placeholder="Enter Your Email"
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              className={`form-control rounded-3 border-primary ${
                errors.password ? "is-invalid" : ""
              }`}
              autoComplete="new-password"
              type="password"
              name="password"
              value={values.password}
              placeholder="Enter Your Password"
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              className={`form-control rounded-3 border-primary ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
              autoComplete="new-password"
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              placeholder="Confirm Password"
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Register
          </button>
          <Link
            to="/"
            type="button"
            className="btn btn-default border w-100 bg-danger text-decoration-none text-white ">
            Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
