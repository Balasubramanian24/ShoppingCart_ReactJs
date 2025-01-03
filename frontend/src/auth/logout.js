import { useNavigate } from "react-router-dom";


const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        navigate('/login');
    };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
        Logout
    </button>
  )
}

export default Logout