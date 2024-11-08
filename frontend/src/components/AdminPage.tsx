import React, { useEffect, useState } from "react";
import { useProductContext } from "../utils/useProductContext";
import { useAuth } from "../utils/useAuth";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./Logout";
import useInactivityTimeout from "../utils/inactivityTimeout";
import AdminLogsPage from "./AdminLogsPage";
import ProductForm from "./ProductForm";
import ProductList from "./ProductsList";
import axios from "axios";

const AdminPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [showLogs, setShowLogs] = useState(false); // Toggle for Admin Logs
  const [showProductForm, setShowProductForm] = useState(false); // Toggle for Product Form
  const { fetchProducts } = useProductContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useInactivityTimeout();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchAdminContent = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/adminpage`, {
          withCredentials: true,
        });
        setMessage(response.data);
        await fetchProducts();
      } catch (error) {
        console.error("Error fetching admin page content:", error);
      }
    };

    fetchAdminContent();
  }, [user, navigate, API_BASE_URL, fetchProducts]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold  text-gray-300 mb-6 text-center">
        Admin Dashboard
      </h1>
      <p className="text-center text-gray-600 mb-6 ">{message}</p>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="w-36 bg-blue-500 text-white py-2 rounded hover:bg-green-600 focus:outline-none"
        >
          {showLogs ? "Hide Admin Logs" : "View Admin Logs"}
        </button>

        <button
          onClick={() => setShowProductForm(!showProductForm)}
          className="w-36 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 focus:outline-none"
        >
          {showProductForm ? "Hide Add Product Form" : "Add New Product"}
        </button>
      </div>

      {showLogs && <AdminLogsPage />}
      {showProductForm && <ProductForm />}

      <div className="w-3/4 m-4 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
        <ProductList />
      </div>

      {user && <LogoutButton />}
    </div>
  );
};
export default AdminPage;
