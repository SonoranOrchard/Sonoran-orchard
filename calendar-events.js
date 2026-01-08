document.addEventListener("DOMContentLoaded", () => {
    const CALENDAR_ID = "d23828d798e4a7d03c723a28a24462c5c42008db6aaf228da6611e1568b7b275@group.calendar.google.com";
    const API_KEY = "AIzaSyCHB_y60zNztsejayRVeg7rkTvySLCmR-4";
    const MAX_EVENTS = 5;

    const eventsList = document.getElementById("events-list");
    if (!eventsList) return;

    const now = new Date().toISOString();

    const url =
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events` +
        `?key=${API_KEY}` +
        `&timeMin=${now}` +
        `&maxResults=${MAX_EVENTS}` +
        `&singleEvents=true` +
        `&orderBy=startTime`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            eventsList.innerHTML = "";

            if (!data.items || data.items.length === 0) {
                eventsList.innerHTML = "<li>No upcoming events</li>";
                return;
            }

            data.items.forEach(event => {
                const li = document.createElement("li");

                const start = event.start.dateTime || event.start.date;
                const date = new Date(start);

                const formattedDate = date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric"
                });

                li.innerHTML = `
                    <strong>${formattedDate}</strong><br>
                    ${event.summary || "Event"}
                `;

                eventsList.appendChild(li);
            });
        })
        .catch(err => {
            console.error("Calendar error:", err);
            eventsList.innerHTML = "<li>Unable to load events</li>";
        });
});
