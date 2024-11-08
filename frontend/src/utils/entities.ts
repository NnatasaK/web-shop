export interface User {
  username: string;
  role: 'user' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface ProtectedRouteProps {
  children: JSX.Element;
  roleRequired?: 'user' | 'admin';
}

export interface Review {
  id: number;
  username: string;
  content: string;
  productId: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdBy?: string;
}

export interface ProductContextType {
  products: Product[];
  loading: boolean;
  fetchProducts: () => void;
  createProduct: (productData: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (productId: number, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
}

export interface Reservation {
  id: number;
  productId: number;
  userId: string;
  reservedAt: string; // Timestamp of reservation
}

export interface LoginLog {
  time: string;
  username: string;
  success: boolean;
  ip_address: string;
  user_agent: string;
}
