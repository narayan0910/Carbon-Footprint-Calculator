import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, LogOut, Leaf } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    return (
        <aside className="sidebar">
            <div className="logo-section">
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                    <Leaf size={28} color="#34D399" />
                </div>
                <h2 className="logo-text">EcoTrack</h2>
            </div>

            <nav style={{ flex: 1 }}>
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                    <LayoutDashboard size={20} /> Dashboard
                </Link>
                <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                    <User size={20} /> Profile
                </Link>
            </nav>

            <button onClick={logout} className="nav-link logout-btn w-full">
                <LogOut size={20} /> Sign Out
            </button>
        </aside>
    );
};

export default Sidebar;
