import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Profile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h1 className="text-2xl font-bold">Profile</h1>
            </header>
            <div className="card" style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>{user?.name}</h2>
                        <p style={{ margin: 0, color: '#718096' }}>{user?.email}</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold mb-2">Account Settings</h3>
                    <p>Change password and other settings coming soon.</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
