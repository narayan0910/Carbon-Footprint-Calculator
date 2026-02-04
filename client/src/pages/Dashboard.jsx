import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Plus, Trash2, Zap, Plane, Utensils, Leaf } from 'lucide-react';
import ActivityForm from '../components/ActivityForm';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [activities, setActivities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState({ total: 0, byType: {} });
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/activities');
            setActivities(res.data);
            calculateStats(res.data);
            fetchRecommendations();
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRecommendations = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/activities/recommendations');
            setRecommendations(res.data.recommendations || []);
        } catch (err) {
            console.error(err);
        }
    }

    const calculateStats = (data) => {
        const total = data.reduce((acc, curr) => acc + curr.emission, 0);
        const byType = { transport: 0, energy: 0, diet: 0 };
        data.forEach(a => {
            if (byType[a.type] !== undefined) byType[a.type] += a.emission;
        });
        setStats({ total: total.toFixed(2), byType });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`http://localhost:5000/api/activities/${id}`);
                fetchActivities();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const chartData = {
        labels: ['Transport', 'Energy', 'Diet'],
        datasets: [
            {
                label: 'Emissions (kg CO2e)',
                data: [stats.byType.transport, stats.byType.energy, stats.byType.diet],
                backgroundColor: ['#10B981', '#F59E0B', '#3B82F6'],
                borderRadius: 8,
                barThickness: 50,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1F2937',
                padding: 12,
                cornerRadius: 8,
            }
        },
        scales: {
            y: { grid: { display: true, color: '#E5E7EB' }, border: { display: false } },
            x: { grid: { display: false }, border: { display: false } }
        },
        maintainAspectRatio: false
    };

    return (
        <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 800, margin: 0, color: '#111827' }}>Dashboard</h1>
                    <p style={{ marginTop: '0.25rem', color: '#6B7280' }}>Welcome back, {user?.name}</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Plus size={20} /> Log Activity
                </button>
            </header>

            <div className="dashboard-grid">
                <div className="card stat-card">
                    <div style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.1 }}>
                        <Leaf size={64} color="#10B981" />
                    </div>
                    <span className="stat-label">Total Emissions</span>
                    <span className="stat-value">{stats.total} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#6B7280' }}>kg CO2e</span></span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">Transport</span>
                    <span className="stat-value" style={{ color: '#10B981' }}>{stats.byType.transport?.toFixed(1)}</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">Energy</span>
                    <span className="stat-value" style={{ color: '#F59E0B' }}>{stats.byType.energy?.toFixed(1)}</span>
                </div>
                <div className="card stat-card">
                    <span className="stat-label">Diet</span>
                    <span className="stat-value" style={{ color: '#3B82F6' }}>{stats.byType.diet?.toFixed(1)}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Emission Breakdown</h3>
                    <div style={{ height: '300px' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>
                <div className="card" style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)', border: '1px solid #A7F3D0' }}>
                    <div className="flex items-center gap-2 mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '8px', background: '#D1FAE5', borderRadius: '50%', color: '#059669' }}>
                            <Zap size={20} />
                        </div>
                        <h3 style={{ fontWeight: 700, margin: 0, color: '#064E3B' }}>AI Recommendations</h3>
                    </div>
                    <ul style={{ paddingLeft: '0', listStyle: 'none', margin: 0 }}>
                        {recommendations.map((rec, i) => (
                            <li key={i} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.6)', borderRadius: '8px', border: '1px solid #D1FAE5', color: '#064E3B', fontSize: '0.95rem', display: 'flex', gap: '0.75rem' }}>
                                <span style={{ color: '#10B981' }}>•</span> {rec}
                            </li>
                        ))}
                        {recommendations.length === 0 && <li style={{ color: '#6B7280' }}>No recommendations yet. Start logging to get AI insights!</li>}
                    </ul>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Recent Activities</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Details</th>
                                <th>Emission (kg)</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map(activity => (
                                <tr key={activity._id}>
                                    <td>{new Date(activity.date).toLocaleDateString()}</td>
                                    <td>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, textTransform: 'capitalize' }}>
                                            {activity.type === 'transport' && <Plane size={16} className="text-emerald-500" style={{ color: '#10B981' }} />}
                                            {activity.type === 'energy' && <Zap size={16} className="text-amber-500" style={{ color: '#F59E0B' }} />}
                                            {activity.type === 'diet' && <Utensils size={16} className="text-blue-500" style={{ color: '#3B82F6' }} />}
                                            {activity.type}
                                        </span>
                                    </td>
                                    <td style={{ color: '#4B5563' }}>
                                        {activity.type === 'transport' && `${activity.details.mode} • ${activity.details.distance}km`}
                                        {activity.type === 'energy' && `${activity.details.source} • ${activity.details.value}kWh`}
                                        {activity.type === 'diet' && `${activity.details.mealType}`}
                                    </td>
                                    <td style={{ fontWeight: 600, color: '#111827' }}>{activity.emission.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => handleDelete(activity._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {activities.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>No activities logged yet.</div>}
                </div>
            </div>

            {showModal && <ActivityForm onClose={() => setShowModal(false)} refresh={fetchActivities} />}
        </div>
    );
};

export default Dashboard;
