import { renderCalendar } from "../components/calendar.js";
import { t } from "../utils/i18n.js";

export function Availability() {
    document.title = "Marvido Apartment - Availability";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute(
            "content",
            "Check availability and book your stay at Marvido Apartment in Jávea, Costa Blanca, Spain."
        );
    }

    return `
        <section class="availability container section">

            <div class="availability-intro">
                <span class="about-eyebrow">${t("availability.eyebrow")}</span>
                <h1>${t("availability.title")}</h1>
                <p>${t("availability.intro")}</p>
            </div>

            <div id="availability-calendar" class="calendar">
                <p class="calendar-loading">${t("availability.loading") || "Loading calendar..."}</p>
            </div>

        </section>
    `;
}

let currentYear;
let currentMonth;

// Module-level cache — persists across SPA navigation since the module stays
// loaded in memory, but resets naturally on a full page reload.
let cache = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes — bookings/prices don't change second-to-second

async function getAvailabilityData() {
    const isFresh = cache && (Date.now() - cacheTime < CACHE_TTL);
    if (isFresh) return cache;

    const [bookingsRes, pricesRes] = await Promise.all([
        fetch("/api/availability"),
        fetch("/api/prices")
    ]);

    const bookings = await bookingsRes.json();
    const prices = await pricesRes.json();

    cache = { bookings, prices };
    cacheTime = Date.now();

    return cache;
}

export async function initAvailability() {
    const { bookings, prices } = await getAvailabilityData();

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