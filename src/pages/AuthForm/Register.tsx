import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Modal from "../../assets/modal/modal"; // Adjust the import path as necessary

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
        setIsSuccess(true);
        setShowModal(true);
      } else {
        setMessage(data.message || "Registration failed");
        setIsSuccess(false);
        setShowModal(true);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setIsSuccess(false);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (isSuccess) {
      setRedirect(true); // Redirect to login after successful registration
    }
  };

  // Redirect to login page after successful registration
  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 border w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 border w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 border w-full rounded"
          />
        </div>
        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </div>

      {/* Modal for success/error messages */}
      {showModal && (
        <Modal
          isOpen={showModal}
          title={isSuccess ? "Success" : "Error"}
          description={message}
          onClose={handleCloseModal}
          type={isSuccess ? "success" : "error"} // Pass the type prop
        />
      )}
    </div>
  );
};

export default Register;