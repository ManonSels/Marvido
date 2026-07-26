import { renderCalendar } from "../components/calendar.js";

export function Availability() {
    return `
        <section class="availability container section">

            <div class="availability-intro">
                <span class="about-eyebrow">Availability</span>
                <h1>Check the calendar</h1>
                <p>Dates shown in black are already booked.</p>
            </div>

            <div id="availability-calendar" class="calendar"></div>

        </section>
    `;
}

let currentYear;
let currentMonth;

export async function initAvailability() {
    const res = await fetch("/api/availability");
    const bookings = await res.json();

    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();

    renderCalendar("availability-calendar", currentYear, currentMonth, bookings, {
        editable: false,
        onMonthChange: (year, month) => {
            currentYear = year;
            currentMonth = month;
        }
    });
}