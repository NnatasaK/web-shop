import ProductList from "./ProductsList";
import { useAuth } from "../utils/useAuth";
import LogoutButton from "./Logout";
import useInactivityTimeout from "../utils/inactivityTimeout";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  useInactivityTimeout();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome to the Web Shop, {user?.username}!
      </h1>
      <ProductList />
      {user && <LogoutButton />}
    </div>
  );
};

export default HomePage;
