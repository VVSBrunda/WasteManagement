import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <UserPlus size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
        <h1>Join EcoWaste</h1>
        <p>Create an account to track waste</p>
      </div>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" value={name} onChange={onChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" value={email} onChange={onChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} minLength="6" className="form-control" required />
        </div>
        <button type="submit" className="btn btn-block">Register</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
