const meetingModel = require('../models/meeting-model');
const userModel = require('../models/user-model');
const sendMeetingEmail = require('../utils/mailer');
const debug = require('debug')('development:meetingController');
const generateGoogleCalendarLink = require('../utils/calender');

module.exports.createMeeting = async (req, res) => {
    try {
        const { title, participants, startTime, endTime, description, location } = req.body;

        const organizer = req.user?.userid;

        if (!organizer) {
            return res.status(401).json({ success: false, message: "Unauthorized: Organizer not found" });
        }

        const organizerData = await userModel.findOne({ _id: organizer });
        if (!title || !participants || !startTime || !endTime) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const participantUsers = await userModel.find({ _id: { $in: participants } }).select('email');
        const participantEmails = participantUsers.map(user => user.email);


        const meetingData = {
            title: title,
            startDateTime: startTime,
            endDateTime: endTime,
            description: description,
            location: location,
            attendees: [participantEmails]
        };

        const calendarLink = generateGoogleCalendarLink(meetingData);



        await sendMeetingEmail({
            to: participantEmails,
            organizerName: organizerData.name,
            title,
            startTime,
            endTime,
            description,
            location,
            calendarLink
        });




        const meeting = await meetingModel.create({
            title,
            organizer,
            participants,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            description,
            location
        });

        return res.status(201).json({ success: true, message: "Meeting created successfully", meeting });

    } catch (err) {
        console.error("Failed to create meeting", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports.getAllMeetings = async (req, res) => {
    try {

        const meetings = await meetingModel.find({
            $or: [
                { organizer: req.user.userid },
                { participants: req.user.userid }
            ]
        }).sort({ startTime: 1 });

        return res.status(200).json({ success: true, meetingsData: meetings });

    } catch (err) {
        debug('Error in getting meeting', err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


module.exports.updateMeeting = async (req, res) => {
    try {
        const meetingId = req.params.id;
        const userId = req.user?.userid;;

        const meeting = await meetingModel.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({ success: false, message: "Meeting not found" });
        }

        if (meeting.organizer.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this meeting" });
        }

        const { title, participants, startTime, endTime, description, location } = req.body;

        if (title) meeting.title = title;
        if (participants) meeting.participants = participants;
        if (startTime) meeting.startTime = startTime;
        if (endTime) meeting.endTime = endTime;
        if (description) meeting.description = description;
        if (location) meeting.location = location;

        await meeting.save();

        return res.status(200).json({ success: true, message: "Meeting updated successfully", updatedMeeting: meeting });

    } catch (err) {
        debug("Update Meeting Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}


module.exports.deleteMeeting = async (req, res) => {
    try {
        const meetingId = req.params.id;
        const userId = req.user?.userid;

        const meeting = await meetingModel.findById(meetingId);

        if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });

        if (meeting.organizer.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this meeting" });
        }

        await meetingModel.findByIdAndDelete(meetingId);

        return res.status(200).json({ success: true, message: "Meeting Deleted Successfully" });


    } catch (err) {
        debug("Failed to Delete", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });

    }
}