import React from 'react';
import { useAuth } from '../useAuth';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <h1>Welcome to the Web Shop, {user?.username}!</h1>

      {/* Product listing visible to both users and admins */}
      <div className="products">
        <h2>Available Products</h2>
        <div className="product-list">
          {/* Render products here */}
          <div className="product-item">
            <p>Product Name</p>
            <p>$10.00</p>
          </div>
          {/* Add more products as needed */}
        </div>
      </div>

      {/* Admin-specific product management tools */}
      {user?.role === 'admin' && (
        <div className="admin-tools">
          <h2>Admin Tools</h2>
          <button>Add New Product</button>
          {/* Additional admin options like editing or removing products */}
        </div>
      )}
    </div>
  );
};

export default HomePage;
