import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { Product, ProductContextType } from "../utils/entities";

export const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`, {
        withCredentials: true,
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const createProduct = async (productData: Omit<Product, "id">) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/products/create`, productData, {
        withCredentials: true,
      });
      await fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (
    productId: number,
    productData: Partial<Product>
  ) => {
    setLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/products/${productId}`,
        productData,
        {
          withCredentials: true,
        }
      );
      await fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: number) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${productId}`, {
        withCredentials: true,
      });
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
