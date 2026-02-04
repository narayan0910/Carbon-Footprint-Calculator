const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};

// Calculate emission helper
const calculateEmission = (type, details) => {
    let emission = 0;
    if (type === 'transport') {
        const { mode, distance } = details;
        if (mode === 'car') emission = distance * 0.12;
        else if (mode === 'flight') emission = distance * 0.255;
        else if (mode === 'bus') emission = distance * 0.08;
        else if (mode === 'train') emission = distance * 0.04;
        else emission = distance * 0.1; // fallback
    } else if (type === 'energy') {
        const { source, value } = details; // value in kWh
        if (source === 'electricity') emission = value * 0.5;
        else if (source === 'gas') emission = value * 2.0;
        else emission = value * 0.5;
    } else if (type === 'diet') {
        const { mealType } = details;
        if (mealType === 'beef') emission = 6.0;
        else if (mealType === 'vegetarian') emission = 1.5;
        else if (mealType === 'chicken') emission = 2.5;
        else if (mealType === 'pork') emission = 3.0;
        else emission = 2.0;
    }
    return parseFloat(emission.toFixed(2));
};

// Get all activities
router.get('/', auth, async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user.id }).sort({ date: -1 });
        res.json(activities);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add activity
router.post('/', auth, async (req, res) => {
    const { type, details, date } = req.body;
    try {
        // AI Integration Point: Could refine emission calc here with AI if requested
        const emission = calculateEmission(type, details);
        const newActivity = new Activity({
            user: req.user.id,
            type,
            details,
            date: date || Date.now(),
            emission
        });
        const activity = await newActivity.save();
        res.json(activity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete activity
router.delete('/:id', auth, async (req, res) => {
    try {
        let activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ msg: 'Activity not found' });
        if (activity.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await Activity.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Activity removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// AI Recommendations (Mocked or Basic for now)
router.post('/recommendations', auth, async (req, res) => {
    // Basic rule-based engine first
    // In a real scenario, call OpenAI API here
    try {
        const activities = await Activity.find({ user: req.user.id }).limit(10);
        let recommendations = [];

        const totalEmission = activities.reduce((acc, curr) => acc + curr.emission, 0);

        if (totalEmission > 100) {
            recommendations.push("Your recent emissions are high. Consider reducing air travel.");
        }

        // Category specific
        const transport = activities.filter(a => a.type === 'transport');
        if (transport.length > 0) {
            recommendations.push("Consider carpooling or using public transport to reduce transport emissions.");
        }

        const diet = activities.filter(a => a.type === 'diet' && a.details.mealType === 'beef');
        if (diet.length > 0) {
            recommendations.push("Switching to one vegetarian meal a day can significantly lower your footprint.");
        }

        if (recommendations.length === 0) recommendations.push("Great job! Keep tracking to stay aware.");

        res.json({ recommendations, totalEmission });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
