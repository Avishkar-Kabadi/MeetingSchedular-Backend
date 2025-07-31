const nodemailer = require('nodemailer');
const debug = require('debug')('development:emailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASS,
    },
});

/**
 * Sends a meeting invitation email
 * @param {Object} options
 * @param {string[]} options.to - Array of email addresses
 * @param {string} options.organizerName
 * @param {string} options.title
 * @param {string} options.startTime
 * @param {string} options.endTime
 * @param {string} [options.description]
 * @param {string} [options.location]
 * @param {string} options.calendarLink
 */
const sendMeetingEmail = async ({
    to,
    organizerName,
    title,
    startTime,
    endTime,
    description,
    location,
    calendarLink
}) => {
    const html = `
    <h2>${title}</h2>
    <p><strong>Organizer:</strong> ${organizerName}</p>
    <p><strong>Start Time:</strong> ${new Date(startTime).toLocaleString()}</p>
    <p><strong>End Time:</strong> ${new Date(endTime).toLocaleString()}</p>
    ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
    ${description ? `<p><strong>Description:</strong> ${description}</p>` : ''}
     ${calendarLink ? `<p><strong>Add to Calender:</strong> ${calendarLink}</p>` : ''}
    <p>You are invited to attend this meeting. Please be on time.</p>
  `;

    const mailOptions = {
        from: `"${organizerName}" <razergaming1828@gmail.com>`,
        to: to.join(','), // convert array to comma-separated string
        subject: `Meeting Invitation: ${title}`,
        html,
    };
    debug(organizerName)
    debug(to);

    try {
        await transporter.sendMail(mailOptions);
        debug('Meeting invitation email sent successfully');
    } catch (error) {
        debug('Error sending meeting email:', error);
    }
};

module.exports = sendMeetingEmail;



function generateGoogleCalendarLink({
    title,
    startDateTime, // ISO 8601 string
    endDateTime,
    description,
    location,
    attendees = [],
}) {
    const formatDate = (dateStr) =>
        new Date(dateStr).toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

    const start = formatDate(startDateTime);
    const end = formatDate(endDateTime);

    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.set('action', 'TEMPLATE');
    url.searchParams.set('text', title);
    url.searchParams.set('dates', `${start}/${end}`);
    url.searchParams.set('details', description);
    url.searchParams.set('location', location);
    if (attendees.length > 0) {
        url.searchParams.set('add', attendees.join(','));
    }

    return url.toString();
}
