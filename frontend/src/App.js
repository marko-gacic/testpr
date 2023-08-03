import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Forms from "./components/Forms";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AuthService from "./Auth/AuthService";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/form-details/:id" element={<Forms />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
