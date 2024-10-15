import AppRouter from './AppRouter';
import { AuthProvider } from './context/authContext';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;