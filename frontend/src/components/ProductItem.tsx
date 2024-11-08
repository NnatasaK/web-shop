import React, { useEffect, useState } from "react";
import { Product } from "../utils/entities";
import { useAuth } from "../utils/useAuth";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const { user } = useAuth();
  const [stock, setStock] = useState(product.stock);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleReserve = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/products/${product.id}/reserve`,
        {},
        {
          withCredentials: true,
        }
      );
      alert("Product reserved successfully!");
      setStock(stock - 1);
    } catch (error) {
      console.error("Error reserving product:", error);
    }
  };

  useEffect(() => {
    setStock(product.stock);
  }, [product.stock]);

  return (
    <div className="p-6 border rounded shadow-lg bg-white mb-4">
      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-gray-500 mb-1">Price: ${product.price}</p>
      <p className="text-gray-500 mb-3">
        Stock: {stock > 0 ? stock : "Out of stock"}
      </p>

      {user?.role === "admin" && (
        <div className="flex space-x-2 mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Edit
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Delete
          </button>
        </div>
      )}
      {user && user.role === "user" && stock > 0 && (
        <button
          onClick={handleReserve}
          className="bg-yellow-500 text-white px-4 py-2 rounded mt-4 hover:bg-yellow-600"
        >
          Reserve
        </button>
      )}

      {/* Review Section */}
      <div className="mt-6">
        <ReviewForm productId={product.id} />
        <ReviewList productId={product.id} />
      </div>
    </div>
  );
};

export default ProductItem;
