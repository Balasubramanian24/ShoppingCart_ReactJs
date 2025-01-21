import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!username || !email || !password) {
      setError("Please fill all the fields..")
      return;
    }
    
    //password length validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    axios.post('http://localhost:5000/auth/signup', { username, email, password })
      .then((result) => {
        console.log('Signup success:', result);
        navigate('/login')
      })
    .catch((err) =>  {
        setError(err.response?.data?.message || 'Signup failed');
        console.log(err);
      }); 
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="text-center mb-4">Signup</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    className="form-control"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    placeholder='Mail ID'
                    name="email"
                    className="form-control"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    placeholder="password"
                    name="password"
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Signup
                </button>
              </form>
              <p className="text-center mt-3">Already have an Account? Please Login here.</p>
              <div className="text-center">
                <Link to="/login" className="btn btn-primary w-50">
                  Login
                </Link>
              </div>
              {error && (
                <div className="alert alert-danger m-2 p-2 text-center">{error}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
