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

let activeTab = "bookings";

async function renderDashboard(root) {
    root.innerHTML = `
        <div class="admin-dashboard">
            <div class="admin-header">
                <h1>Admin</h1>
                <button id="admin-logout">Log out</button>
            </div>

            <div class="admin-tabs">
                <button class="admin-tab-btn ${activeTab === "bookings" ? "active" : ""}" data-tab="bookings">Bookings</button>
                <button class="admin-tab-btn ${activeTab === "pricing" ? "active" : ""}" data-tab="pricing">Pricing</button>
            </div>

            <div id="admin-tab-content"></div>
        </div>
    `;

    document.getElementById("admin-logout").addEventListener("click", async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        renderLogin(root);
    });

    document.querySelectorAll(".admin-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            activeTab = btn.dataset.tab;
            renderTabs();
        });
    });

    renderTabs();
}

function renderTabs() {
    document.querySelectorAll(".admin-tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === activeTab);
    });

    if (activeTab === "bookings") {
        renderBookingsTab();
    } else {
        renderPricingTab();
    }
}


/* ---------------- BOOKINGS TAB ---------------- */

let selectedStart = null;
let bookingsCache = [];
let editingId = null;
let bookingsViewYear;
let bookingsViewMonth;

async function renderBookingsTab() {
    const content = document.getElementById("admin-tab-content");

    content.innerHTML = `
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
    `;

    const today = new Date();
    bookingsViewYear = today.getFullYear();
    bookingsViewMonth = today.getMonth();

    await loadBookingsAndRender();
}

async function loadBookingsAndRender() {
    const res = await fetch("/api/admin/bookings");
    bookingsCache = await res.json();

    renderCalendar("admin-calendar", bookingsViewYear, bookingsViewMonth, bookingsCache, {
        editable: true,
        showStatus: true,
        onDayClick: handleDayClick,
        onMonthChange: (year, month) => {
            bookingsViewYear = year;
            bookingsViewMonth = month;
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
            alert("Server error while saving.");
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
        alert("Network or server error while saving.");
    }
}

async function deleteBooking(id) {
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    await loadBookingsAndRender();
}

function renderBookingsList() {
    const listEl = document.getElementById("admin-bookings-list");
    if (!listEl) return;

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

            if (!noteEl || !startEl || !endEl || !statusEl) return;

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


/* ---------------- PRICING TAB ---------------- */

let selectedPriceStart = null;
let pricesCache = [];
let editingPriceId = null;
let pricingViewYear;
let pricingViewMonth;

async function renderPricingTab() {
    const content = document.getElementById("admin-tab-content");

    content.innerHTML = `
        <p class="admin-instructions">
            Enter a price per night, then click a start date and an end date to apply it to that range.
        </p>

        <div class="admin-new-form">
            <input type="number" id="admin-price-input" class="admin-note-input" placeholder="Price per night (€)" min="0" step="0.01">
        </div>

        <p class="admin-form-error" id="admin-price-form-error"></p>

        <div id="admin-price-calendar" class="calendar"></div>

        <h2 class="admin-list-title">Current price ranges</h2>
        <div id="admin-prices-list"></div>
    `;

    const today = new Date();
    pricingViewYear = today.getFullYear();
    pricingViewMonth = today.getMonth();

    await loadPricesAndRender();
}

async function loadPricesAndRender() {
    const res = await fetch("/api/admin/prices");
    pricesCache = await res.json();

    renderCalendar("admin-price-calendar", pricingViewYear, pricingViewMonth, [], {
        editable: true,
        onDayClick: handlePriceDayClick,
        onMonthChange: (year, month) => {
            pricingViewYear = year;
            pricingViewMonth = month;
        },
        dayContent: (dateStr) => {
            const match = pricesCache.find(p => dateStr >= p.start_date && dateStr <= p.end_date);
            return match ? `€${match.price_per_night}` : "";
        }
    });

    renderPricesList();
}

function showPriceFormError(message) {
    const el = document.getElementById("admin-price-form-error");
    if (el) el.textContent = message || "";
}

function handlePriceDayClick(dateStr) {
    showPriceFormError("");

    if (!selectedPriceStart) {
        selectedPriceStart = dateStr;
        highlightSelection(dateStr, dateStr);
        return;
    }

    const start = selectedPriceStart < dateStr ? selectedPriceStart : dateStr;
    const end = selectedPriceStart < dateStr ? dateStr : selectedPriceStart;

    const priceInput = document.getElementById("admin-price-input");
    const price = priceInput ? parseFloat(priceInput.value) : null;

    if (!price || price <= 0) {
        showPriceFormError("Enter a valid price before selecting dates.");
        selectedPriceStart = null;
        return;
    }

    addPrice(start, end, price);
    selectedPriceStart = null;
}

async function addPrice(start_date, end_date, price_per_night) {
    try {
        const res = await fetch("/api/admin/prices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ start_date, end_date, price_per_night })
        });

        const data = await res.json();

        if (!res.ok) {
            showPriceFormError(data.error || "Something went wrong.");
            return;
        }

        await loadPricesAndRender();

    } catch (err) {
        console.error("addPrice failed:", err);
        showPriceFormError("Something went wrong. Check the console.");
    }
}

async function updatePrice(id, start_date, end_date, price_per_night) {
    try {
        const res = await fetch(`/api/admin/prices/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ start_date, end_date, price_per_night })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Something went wrong.");
            return;
        }

        editingPriceId = null;
        await loadPricesAndRender();

    } catch (err) {
        console.error("updatePrice failed:", err);
        alert("Network or server error while saving.");
    }
}

async function deletePrice(id) {
    await fetch(`/api/admin/prices/${id}`, { method: "DELETE" });
    await loadPricesAndRender();
}

function renderPricesList() {
    const listEl = document.getElementById("admin-prices-list");
    if (!listEl) return;

    if (pricesCache.length === 0) {
        listEl.innerHTML = `<p class="admin-empty">No prices set yet.</p>`;
        return;
    }

    listEl.innerHTML = pricesCache.map(p => {
        if (editingPriceId === p.id) {
            return `
                <div class="admin-booking-row admin-booking-editing">
                    <input type="number" class="edit-price" value="${p.price_per_night}" min="0" step="0.01">
                    <input type="date" class="edit-start" value="${p.start_date}">
                    <input type="date" class="edit-end" value="${p.end_date}">
                    <button class="admin-price-save-btn" data-id="${p.id}">Save</button>
                    <button class="admin-price-cancel-btn">Cancel</button>
                </div>
            `;
        }

        return `
            <div class="admin-booking-row">
                <span class="admin-booking-note">€${p.price_per_night} / night</span>
                <span class="admin-booking-dates">${p.start_date} &rarr; ${p.end_date}</span>
                <button data-id="${p.id}" class="admin-price-edit-btn">Edit</button>
                <button data-id="${p.id}" class="admin-price-delete-btn">Remove</button>
            </div>
        `;
    }).join("");

    listEl.querySelectorAll(".admin-price-delete-btn").forEach(btn => {
        btn.addEventListener("click", () => deletePrice(btn.dataset.id));
    });

    listEl.querySelectorAll(".admin-price-edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            editingPriceId = parseInt(btn.dataset.id);
            renderPricesList();
        });
    });

    listEl.querySelectorAll(".admin-price-cancel-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            editingPriceId = null;
            renderPricesList();
        });
    });

    listEl.querySelectorAll(".admin-price-save-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const row = btn.closest(".admin-booking-row");
            if (!row) return;

            const priceEl = row.querySelector(".edit-price");
            const startEl = row.querySelector(".edit-start");
            const endEl = row.querySelector(".edit-end");

            if (!priceEl || !startEl || !endEl) return;

            const price_per_night = parseFloat(priceEl.value);
            const start_date = startEl.value;
            const end_date = endEl.value;

            if (!start_date || !end_date || !price_per_night) {
                alert("A valid price and both dates are required.");
                return;
            }

            updatePrice(btn.dataset.id, start_date, end_date, price_per_night);
        });
    });
}