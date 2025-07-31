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

module.exports = generateGoogleCalendarLink;