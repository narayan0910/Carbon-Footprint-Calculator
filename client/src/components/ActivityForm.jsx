import { useState, useContext } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const ActivityForm = ({ onClose, refresh }) => {
    const [type, setType] = useState('transport');
    const [details, setDetails] = useState({});

    // Auxiliary state for inputs
    const [distance, setDistance] = useState('');
    const [mode, setMode] = useState('car');
    const [source, setSource] = useState('electricity');
    const [value, setValue] = useState('');
    const [mealType, setMealType] = useState('vegetarian');

    const handleSubmit = async (e) => {
        e.preventDefault();
        let payloadDetails = {};

        if (type === 'transport') {
            payloadDetails = { mode, distance: parseFloat(distance) };
        } else if (type === 'energy') {
            payloadDetails = { source, value: parseFloat(value) };
        } else if (type === 'diet') {
            payloadDetails = { mealType };
        }

        try {
            await axios.post('http://localhost:5000/api/activities', {
                type,
                details: payloadDetails,
                date: new Date()
            });
            refresh();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Error adding activity');
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', margin: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="text-xl font-bold m-0">Log Activity</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Category</label>
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="transport">Transportation</option>
                            <option value="energy">Energy Consumption</option>
                            <option value="diet">Diet & Food</option>
                        </select>
                    </div>

                    {type === 'transport' && (
                        <>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Mode</label>
                                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                                    <option value="car">Car (Petrol)</option>
                                    <option value="flight">Flight</option>
                                    <option value="bus">Bus</option>
                                    <option value="train">Train</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Distance (km)</label>
                                <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} required min="0" />
                            </div>
                        </>
                    )}

                    {type === 'energy' && (
                        <>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Source</label>
                                <select value={source} onChange={(e) => setSource(e.target.value)}>
                                    <option value="electricity">Electricity</option>
                                    <option value="gas">Natural Gas</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Usage (kWh)</label>
                                <input type="number" value={value} onChange={(e) => setValue(e.target.value)} required min="0" />
                            </div>
                        </>
                    )}

                    {type === 'diet' && (
                        <div style={{ marginBottom: '1rem' }}>
                            <label>Meal Type</label>
                            <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="beef">Beef</option>
                                <option value="chicken">Chicken</option>
                                <option value="pork">Pork</option>
                            </select>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Save Activity</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActivityForm;
