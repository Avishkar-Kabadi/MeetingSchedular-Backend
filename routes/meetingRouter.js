const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { createMeeting, getAllMeetings, updateMeeting,deleteMeeting } = require('../controllers/meetingController');

const router = express.Router();


router.post('/create', isLoggedIn, createMeeting);

router.get('/all', isLoggedIn, getAllMeetings);

router.put('/update/:id', isLoggedIn, updateMeeting);

router.delete('/delete/:id',isLoggedIn, deleteMeeting);

module.exports = router;