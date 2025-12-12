const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');

// 1. GET SETTINGS
router.get('/', async (req, res) => {
  try {
    // Pehli setting dhoondo
    let settings = await Setting.findOne();
    
    // Agar database naya hai aur koi setting nahi hai, to khali object bhej do
    // Frontend isay default values se bhar lega
    if (!settings) {
        return res.json({}); 
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. UPDATE OR CREATE SETTINGS (The Fix)
router.put('/', async (req, res) => {
  try {
    // Logic: Pehli document dhoondo aur update karo.
    // upsert: true -> Agar nahi mili to nayi bana do.
    const settings = await Setting.findOneAndUpdate(
        {}, // Filter: Empty (First document)
        req.body, // New Data
        { new: true, upsert: true, setDefaultsOnInsert: true } // Options
    );
    
    console.log("✅ Settings Saved:", settings._id);
    res.json(settings);
  } catch (err) {
    console.error("Settings Save Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;