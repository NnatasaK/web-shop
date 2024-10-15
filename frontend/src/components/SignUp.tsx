import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';

const SignUp: React.FC = () => {
  const { register, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(username, password);  
    navigate('/login');  
  };

  return (
    <div className="signup-page">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
