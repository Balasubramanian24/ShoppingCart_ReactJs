import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { setUserId } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${import.meta.env.REACT_APP_API_URL}/auth/login`, { email, password })
      .then((result) => {
        if (result.data.token && result.data.user) {
          localStorage.setItem('authToken', result.data.token);
          localStorage.setItem('username', result.data.user.username);
          setUserId(result.data.user.id);
          navigate('/');
        } else {
          setError('Invalid email or password. Please try again.');
        }
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || 'Login failed';
        setError(errorMessage);
        console.log(err.response.data.error);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="text-center mb-4">Login</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
              <p className="mt-3 text-center">Don't have an account? 
                <Link to="/signup" className="btn btn-link">Sign Up</Link>
              </p>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
