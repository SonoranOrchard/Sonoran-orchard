<script>
const ICS_URL = "https://calendar.google.com/calendar/ical/d23828d798e4a7d03c723a28a24462c5c42008db6aaf228da6611e1568b7b275%40group.calendar.google.com/public/basic.ics";
const MAX_EVENTS = 5;

function parseICSDate(dateStr) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6) - 1;
    const day = dateStr.substring(6, 8);
    return new Date(year, month, day);
}

async function loadEvents() {
    const list = document.getElementById("events-list");
    if (!list) return;

    try {
        const response = await fetch(ICS_URL);
        const text = await response.text();

        const events = text.split("BEGIN:VEVENT").slice(1);
        const upcoming = [];

        events.forEach(event => {
            const summary = event.match(/SUMMARY:(.+)/);
            const date = event.match(/DTSTART;VALUE=DATE:(\d+)/);

            if (summary && date) {
                const eventDate = parseICSDate(date[1]);
                if (eventDate >= new Date()) {
                    upcoming.push({
                        title: summary[1],
                        date: eventDate
                    });
                }
            }
        });

        upcoming.sort((a, b) => a.date - b.date);

        list.innerHTML = "";

        upcoming.slice(0, MAX_EVENTS).forEach(event => {
            const li = document.createElement("li");
            li.textContent = `${event.date.toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric"
            })} — ${event.title}`;
            list.appendChild(li);
        });

        if (list.children.length === 0) {
            list.innerHTML = "<li>No upcoming events</li>";
        }

    } catch (err) {
        list.innerHTML = "<li>Unable to load events</li>";
    }
}

document.addEventListener("DOMContentLoaded", loadEvents);
</script>
