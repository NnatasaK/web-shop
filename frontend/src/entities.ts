export interface User {
    username: string;
    role: string;
  }
  
  // Define the AuthContext type
  export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
  }
  
  // Optional: Define any other types that may be reused
  export interface ProtectedRouteProps {
    children: JSX.Element;
    roleRequired?: string;
  }