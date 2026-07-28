import { renderCalendar } from "../components/calendar.js";

export function Availability() {
    return `
        <section class="availability container section">

            <div class="availability-intro">
                <span class="about-eyebrow">Availability</span>
                <h1>Check the calendar</h1>
                <p>Dates shown in black are already booked. Price per night is shown below each day.</p>
            </div>

            <div id="availability-calendar" class="calendar"></div>

        </section>
    `;
}

let currentYear;
let currentMonth;
let pricesCache = [];

export async function initAvailability() {
    const [bookingsRes, pricesRes] = await Promise.all([
        fetch("/api/availability"),
        fetch("/api/prices")
    ]);

    const bookings = await bookingsRes.json();
    pricesCache = await pricesRes.json();

    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();

    renderCalendar("availability-calendar", currentYear, currentMonth, bookings, {
        editable: false,
        onMonthChange: (year, month) => {
            currentYear = year;
            currentMonth = month;
        },
        dayContent: (dateStr) => {
            const match = pricesCache.find(p => dateStr >= p.start_date && dateStr <= p.end_date);
            return match ? `€${match.price_per_night}` : "";
        }
    });
}