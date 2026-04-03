import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { Trash2 } from 'lucide-react'; // Nice little aesthetic brand icon

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="loader">Loading...</div>;
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-brand">
          <Trash2 size={24} color="var(--accent-primary)" />
          EcoWaste
        </div>
        <div className="nav-links">
          {user ? (
            <>
              <span style={{ color: 'var(--text-muted)' }}>Hello, {user.name}</span>
              <button onClick={logout} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>Logout</button>
            </>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </>
          )}
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
