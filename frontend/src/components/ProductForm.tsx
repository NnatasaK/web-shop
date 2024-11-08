import React, { useContext, useState } from "react";
import { ProductContext } from "../context/productContext";

const ProductForm: React.FC = () => {
  const { createProduct } = useContext(ProductContext)!; // Assume ProductContext is available

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name && description && price && stock) {
      await createProduct({
        name,
        description,
        price,
        stock,
      });

      setName("");
      setDescription("");
      setPrice("");
      setStock("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-1/3 mb-4"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-yellow-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-yellow-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Price ($)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value ? parseFloat(e.target.value) : "")
          }
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-yellow-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Stock Quantity
        </label>
        <input
          type="number"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value ? parseInt(e.target.value) : "")
          }
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-yellow-500"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        Add Product
      </button>
    </form>
  );
};

export default ProductForm;
