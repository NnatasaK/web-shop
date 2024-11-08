import AppRouter from './AppRouter';
import { AuthProvider } from './context/authContext';
import { ProductProvider } from './context/productContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <AppRouter />
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;