import { renderCalendar } from "../components/calendar.js";

export function Admin() {
    return `
        <section class="admin container section">
            <div id="admin-root">
                <p>Checking session...</p>
            </div>
        </section>
    `;
}

export async function initAdmin() {
    const root = document.getElementById("admin-root");

    const check = await fetch("/api/admin/test");

    if (check.ok) {
        renderDashboard(root);
    } else {
        renderLogin(root);
    }
}

function renderLogin(root) {
    root.innerHTML = `
        <div class="admin-login">
            <h1>Admin Login</h1>
            <form id="admin-login-form">
                <input type="password" id="admin-password" placeholder="Password" required>
                <button type="submit">Log in</button>
            </form>
            <p class="admin-error" id="admin-error"></p>
        </div>
    `;

    const form = document.getElementById("admin-login-form");
    const errorEl = document.getElementById("admin-error");

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const password = document.getElementById("admin-password").value;

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password })
        });

        if (res.ok) {
            renderDashboard(root);
        } else {
            errorEl.textContent = "Incorrect password.";
        }
    });
}

let selectedStart = null;
let bookingsCache = [];

// Track which month/year the admin is currently viewing so it doesn't reset
let viewYear;
let viewMonth;

async function renderDashboard(root) {
    root.innerHTML = `
        <div class="admin-dashboard">
            <div class="admin-header">
                <h1>Admin</h1>
                <button id="admin-logout">Log out</button>
            </div>

            <p class="admin-instructions">
                Type a name/note below, then click a start date and an end date to mark that range as booked.
            </p>

            <input type="text" id="admin-note-input" class="admin-note-input" placeholder="Guest name or note (optional)">

            <div id="admin-calendar" class="calendar"></div>

            <h2 class="admin-list-title">Current bookings</h2>
            <div id="admin-bookings-list"></div>
        </div>
    `;

    document.getElementById("admin-logout").addEventListener("click", async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        renderLogin(root);
    });

    const today = new Date();
    viewYear = today.getFullYear();
    viewMonth = today.getMonth();

    await loadBookingsAndRender();
}

async function loadBookingsAndRender() {
    const res = await fetch("/api/admin/bookings");
    bookingsCache = await res.json();

    renderCalendar("admin-calendar", viewYear, viewMonth, bookingsCache, {
        editable: true,
        onDayClick: handleDayClick,
        onMonthChange: (year, month) => {
            viewYear = year;
            viewMonth = month;
        }
    });

    renderBookingsList();
}

function handleDayClick(dateStr) {
    if (!selectedStart) {
        selectedStart = dateStr;
        highlightSelection(dateStr, dateStr);
        return;
    }

    const start = selectedStart < dateStr ? selectedStart : dateStr;
    const end = selectedStart < dateStr ? dateStr : selectedStart;

    const noteInput = document.getElementById("admin-note-input");
    const note = noteInput ? noteInput.value.trim() : "";

    addBooking(start, end, note);
    selectedStart = null;
}

function highlightSelection(start, end) {
    document.querySelectorAll(".calendar-day").forEach(el => {
        const d = el.dataset.date;
        if (d && d >= start && d <= end) {
            el.classList.add("selecting");
        }
    });
}

async function addBooking(start_date, end_date, note) {
    await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_date, end_date, note })
    });

    const noteInput = document.getElementById("admin-note-input");
    if (noteInput) noteInput.value = "";

    await loadBookingsAndRender();
}

async function deleteBooking(id) {
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    await loadBookingsAndRender();
}

function renderBookingsList() {
    const listEl = document.getElementById("admin-bookings-list");

    if (bookingsCache.length === 0) {
        listEl.innerHTML = `<p class="admin-empty">No bookings yet.</p>`;
        return;
    }

    listEl.innerHTML = bookingsCache.map(b => `
        <div class="admin-booking-row">
            <span class="admin-booking-note">${b.note ? b.note : "—"}</span>
            <span class="admin-booking-dates">${b.start_date} &rarr; ${b.end_date}</span>
            <button data-id="${b.id}" class="admin-delete-btn">Remove</button>
        </div>
    `).join("");

    listEl.querySelectorAll(".admin-delete-btn").forEach(btn => {
        btn.addEventListener("click", () => deleteBooking(btn.dataset.id));
    });
}