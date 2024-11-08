import React, { useContext, useEffect } from "react";
import { ProductContext } from "../context/productContext";
import ProductItem from "./ProductItem";
import { Product } from "../utils/entities";

const ProductList: React.FC = () => {
  const { products, loading, fetchProducts } = useContext(ProductContext)!;

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.length > 0 ? (
        products.map((product: Product) => (
          <ProductItem key={product.id} product={product} />
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default ProductList;
