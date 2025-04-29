import React, { useState } from "react";
import { useFormContext } from "../context/FormContext";
import { createUser, getForm } from "../api/api";
import { User } from "../types";

const Login: React.FC = () => {
  const { setUser, setForm } = useFormContext();
  const [formData, setFormData] = useState<User>({ rollNumber: "", name: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      try {
        await createUser(formData);
      } catch (error) {
        console.log("User might already exist, proceeding to fetch form");
      }
      const formResponse = await getForm(formData.rollNumber);
      setUser(formData);
      setForm(formResponse.form);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section (Graphic or Info) */}
      <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-teal-400 text-white flex items-center justify-center p-10">
        <div className="max-w-md text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-lg">Login with your Roll Number and Name to access your form.</p>
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">Student Login</h3>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 22CS3001"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., John Doe"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-all duration-200 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
