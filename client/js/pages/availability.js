import { renderCalendar } from "../components/calendar.js";
import { t } from "../utils/i18n.js";

export function Availability() {
    return `
        <section class="availability container section">

            <div class="availability-intro">
                <span class="about-eyebrow">${t("availability.eyebrow")}</span>
                <h1>${t("availability.title")}</h1>
                <p>${t("availability.intro")}</p>
            </div>

            <div id="availability-calendar" class="calendar"></div>

        </section>
    `;
}

let currentYear;
let currentMonth;

export async function initAvailability() {
    const [bookingsRes, pricesRes] = await Promise.all([
        fetch("/api/availability"),
        fetch("/api/prices")
    ]);

    const bookings = await bookingsRes.json();
    const prices = await pricesRes.json();

    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();

    function isBooked(dateStr) {
        return bookings.some(b => dateStr >= b.start_date && dateStr <= b.end_date);
    }

    renderCalendar("availability-calendar", currentYear, currentMonth, bookings, {
        editable: false,
        onMonthChange: (year, month) => {
            currentYear = year;
            currentMonth = month;
        },
        dayContent: (dateStr) => {
            if (isBooked(dateStr)) return ""; // don't show price on booked days

            const match = prices.find(p => dateStr >= p.start_date && dateStr <= p.end_date);
            return match ? `€${match.price_per_night}` : "";
        }
    });
}