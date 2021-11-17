const express = require('express');
const router = express.Router();

const Class = require('../models/class');

// @route POST api/user/classes
// @desc Add new class
// @access Public(temp)
router.post('/classes', async (req, res) => {
    const { name, lesson, topic, room, thumbnail } = req.body;

    // Simple validation
    if (!name)
        res.status(400).json({ success: false, message: "Missing class's name" });

    try {
        // Check for existing class
        const _class = await Class.findOne({ name });

        if(_class)
            res.status(400).json({ success: false, message: "Class's name exists" });

        // All good
        const newClass = new Class({ name, lesson, topic, room, thumbnail });
        await newClass.save();

        res.json({ success: true, message: 'Class created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// @route GET api/user/classes
// @desc Get all classes
// @access Public(temp)
router.get('/classes', async (req, res) => {
    try {
        const classes = await Class.find();
        res.json({ success: true, classes });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


module.exports = router;