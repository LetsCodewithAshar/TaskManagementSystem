import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogOut, FiGrid } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <FiGrid size={20} />
          <span>TaskFlow</span>
        </Link>

        {user && (
          <div className="navbar-right">
            <span className="navbar-user">{user.name}</span>
            <button onClick={handleLogout} className="btn-icon" title="Logout">
              <FiLogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
