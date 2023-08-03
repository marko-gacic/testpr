const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "password",
  database: "examroom",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
    return;
  }
  console.log("Connected to MySQL database!");
  connection.release();
});

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  const values = [username, email, password];

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool:", err.message);
      return res.status(500).json({ error: "An error occurred during registration" });
    }

    connection.query(sql, values, (err, result) => {
      connection.release();
      if (err) {
        console.error("Error registering user:", err.message);
        return res.status(500).json({ error: "An error occurred during registration" });
      }
      console.log("User registered successfully!");
      return res.status(201).json({ message: "Registration successful" });
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  const values = [email];

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool:", err.message);
      return res.status(500).json({ error: "An error occurred during login" });
    }

    connection.query(sql, values, (err, results) => {
      connection.release();
      if (err) {
        console.error("Error during login:", err.message);
        return res.status(500).json({ error: "An error occurred during login" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = results[0];
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      console.log("User logged in successfully!");
      return res.status(200).json({ message: "Login successful" });
    });
  });
});

app.get("/forms", (req, res) => {
  const sql = "SELECT * FROM forms";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool:", err.message);
      return res.status(500).json({ error: "An error occurred while fetching forms" });
    }

    connection.query(sql, (err, results) => {
      connection.release();
      if (err) {
        console.error("Error fetching forms:", err.message);
        return res.status(500).json({ error: "An error occurred while fetching forms" });
      }

      return res.status(200).json(results);
    });
  });
});

app.delete("/forms/:id", (req, res) => {
  const formId = req.params.id;
  const sql = "DELETE FROM forms WHERE id = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool:", err.message);
      return res.status(500).json({ error: "An error occurred while deleting the form" });
    }

    connection.query(sql, [formId], (err, result) => {
      connection.release();
      if (err) {
        console.error("Error deleting form:", err.message);
        return res.status(500).json({ error: "An error occurred while deleting the form" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Form not found" });
      }

      return res.status(200).json({ message: "Form deleted successfully" });
    });
  });
});

app.get("/form-details/:id", (req, res) => {
  const formId = req.params.id;
  const formSql = "SELECT * FROM forms WHERE id = ?";
  const actionSql = "SELECT * FROM form_actions WHERE form_id = ? ORDER BY action_start_time";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection from pool:", err.message);
      return res.status(500).json({ error: "An error occurred while fetching form details" });
    }

    connection.query(formSql, [formId], (err, formResults) => {
      if (err) {
        connection.release();
        console.error("Error fetching form details:", err.message);
        return res.status(500).json({ error: "An error occurred while fetching form details" });
      }

      if (formResults.length === 0) {
        connection.release();
        return res.status(404).json({ error: "Form not found" });
      }

      const formDetails = formResults[0];

      connection.query(actionSql, [formId], (err, actionResults) => {
        connection.release();
        if (err) {
          console.error("Error fetching form actions:", err.message);
          return res.status(500).json({ error: "An error occurred while fetching form actions" });
        }

        const totalWaitingTime = actionResults.reduce(
          (total, action) => total + action.waiting_time,
          0
        );

        const formWithActions = {
          ...formDetails,
          total_waiting_time: totalWaitingTime,
          actions: actionResults,
        };

        return res.status(200).json(formWithActions);
      });
    });
  });
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
