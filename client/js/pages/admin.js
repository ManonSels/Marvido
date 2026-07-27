import { renderCalendar } from "../components/calendar.js";

const STATUS_OPTIONS = [
    { value: "paid", label: "Paid" },
    { value: "deposit", label: "Deposit" },
    { value: "blocked", label: "Blocked" },
    { value: "not_available", label: "Not available" }
];

function statusDropdown(selectedValue, className) {
    return `
        <select class="${className}" id="${className}">
            ${STATUS_OPTIONS.map(opt => `
                <option value="${opt.value}" ${opt.value === selectedValue ? "selected" : ""}>${opt.label}</option>
            `).join("")}
        </select>
    `;
}

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
let editingId = null;

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
                Type a name/note and pick a status, then click a start date and an end date to mark that range.
            </p>

            <div class="admin-new-form">
                <input type="text" id="admin-note-input" class="admin-note-input" placeholder="Guest name or note (optional)">
                ${statusDropdown("paid", "admin-status-input")}
            </div>

            <p class="admin-form-error" id="admin-form-error"></p>

            <div id="admin-calendar" class="calendar"></div>

            <div class="admin-legend">
                <span class="legend-item"><span class="legend-dot status-paid"></span> Paid</span>
                <span class="legend-item"><span class="legend-dot status-deposit"></span> Deposit</span>
                <span class="legend-item"><span class="legend-dot status-blocked"></span> Blocked</span>
                <span class="legend-item"><span class="legend-dot status-not_available"></span> Not available</span>
            </div>

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
        showStatus: true,
        onDayClick: handleDayClick,
        onMonthChange: (year, month) => {
            viewYear = year;
            viewMonth = month;
        }
    });

    renderBookingsList();
}

function showFormError(message) {
    const el = document.getElementById("admin-form-error");
    if (el) el.textContent = message || "";
}

function handleDayClick(dateStr) {
    showFormError("");

    if (!selectedStart) {
        selectedStart = dateStr;
        highlightSelection(dateStr, dateStr);
        return;
    }

    const start = selectedStart < dateStr ? selectedStart : dateStr;
    const end = selectedStart < dateStr ? dateStr : selectedStart;

    const noteInput = document.getElementById("admin-note-input");
    const statusInput = document.getElementById("admin-status-input");

    const note = noteInput ? noteInput.value.trim() : "";
    const status = statusInput ? statusInput.value : "paid";

    addBooking(start, end, note, status);
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

async function addBooking(start_date, end_date, note, status) {
    try {
        const res = await fetch("/api/admin/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ start_date, end_date, note, status })
        });

        const data = await res.json();

        if (!res.ok) {
            showFormError(data.error || "Something went wrong.");
            return;
        }

        const noteInput = document.getElementById("admin-note-input");
        if (noteInput) noteInput.value = "";

        await loadBookingsAndRender();

    } catch (err) {
        console.error("addBooking failed:", err);
        showFormError("Something went wrong. Check the console.");
    }
}

async function updateBooking(id, start_date, end_date, note, status) {
    try {
        const res = await fetch(`/api/admin/bookings/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ start_date, end_date, note, status })
        });

        let data = {};
        try {
            data = await res.json();
        } catch (parseErr) {
            console.error("Response was not valid JSON:", parseErr);
            alert("Server error while saving. Check the console/server log for details.");
            return;
        }

        if (!res.ok) {
            alert(data.error || "Something went wrong.");
            return;
        }

        editingId = null;
        await loadBookingsAndRender();

    } catch (err) {
        console.error("updateBooking failed:", err);
        alert("Network or server error while saving. Check the console.");
    }
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

    listEl.innerHTML = bookingsCache.map(b => {
        if (editingId === b.id) {
            return `
                <div class="admin-booking-row admin-booking-editing">
                    <input type="text" class="edit-note" value="${b.note || ""}" placeholder="Note">
                    <input type="date" class="edit-start" value="${b.start_date}">
                    <input type="date" class="edit-end" value="${b.end_date}">
                    ${statusDropdown(b.status || "paid", "edit-status")}
                    <button class="admin-save-btn" data-id="${b.id}">Save</button>
                    <button class="admin-cancel-btn">Cancel</button>
                </div>
            `;
        }

        return `
            <div class="admin-booking-row status-${b.status || "paid"}">
                <span class="admin-booking-note">${b.note ? b.note : "—"}</span>
                <span class="admin-booking-dates">${b.start_date} &rarr; ${b.end_date}</span>
                <span class="admin-booking-status-tag status-tag-${b.status || "paid"}">
                    ${STATUS_OPTIONS.find(o => o.value === b.status)?.label || "Paid"}
                </span>
                <button data-id="${b.id}" class="admin-edit-btn">Edit</button>
                <button data-id="${b.id}" class="admin-delete-btn">Remove</button>
            </div>
        `;
    }).join("");

    listEl.querySelectorAll(".admin-delete-btn").forEach(btn => {
        btn.addEventListener("click", () => deleteBooking(btn.dataset.id));
    });

    listEl.querySelectorAll(".admin-edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            editingId = parseInt(btn.dataset.id);
            renderBookingsList();
        });
    });

    listEl.querySelectorAll(".admin-cancel-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            editingId = null;
            renderBookingsList();
        });
    });

    listEl.querySelectorAll(".admin-save-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const row = btn.closest(".admin-booking-row");

            if (!row) return;

            const noteEl = row.querySelector(".edit-note");
            const startEl = row.querySelector(".edit-start");
            const endEl = row.querySelector(".edit-end");
            const statusEl = row.querySelector(".edit-status");

            if (!noteEl || !startEl || !endEl || !statusEl) {
                console.error("Could not find edit inputs in row");
                return;
            }

            const note = noteEl.value.trim();
            const start_date = startEl.value;
            const end_date = endEl.value;
            const status = statusEl.value;

            if (!start_date || !end_date) {
                alert("Both start and end dates are required.");
                return;
            }

            updateBooking(btn.dataset.id, start_date, end_date, note, status);
        });
    });
}