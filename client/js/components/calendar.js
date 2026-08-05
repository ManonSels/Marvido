function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function findBookingForDate(dateStr, bookings) {
    return bookings.find(b => dateStr >= b.start_date && dateStr <= b.end_date);
}

export function renderCalendar(containerId, year, month, bookings, options = {}) {
    const {
        editable = false,
        onDayClick = null,
        onMonthChange = null,
        showStatus = false,
        dayContent = null
    } = options;

    const container = document.getElementById(containerId);

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();

    const monthName = firstDay.toLocaleString("default", { month: "long" });

    let html = `
        <div class="calendar-header">
            <button class="calendar-nav" id="cal-prev">&#8592;</button>
            <h3>${monthName} ${year}</h3>
            <button class="calendar-nav" id="cal-next">&#8594;</button>
        </div>
        <div class="calendar-weekdays">
            ${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => `<span>${d}</span>`).join("")}
        </div>
        <div class="calendar-grid">
    `;

    for (let i = 0; i < startWeekday; i++) {
        html += `<div class="calendar-day empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDate(date);
        const booking = findBookingForDate(dateStr, bookings);

        const classes = ["calendar-day"];
        if (booking) classes.push("booked");
        if (editable) classes.push("editable");
        if (showStatus && booking) classes.push(`status-${booking.status || "booked"}`);

        const extra = dayContent ? dayContent(dateStr) : "";

        html += `
            <div class="${classes.join(" ")}" data-date="${dateStr}">
                <span class="calendar-day-number">${day}</span>
                ${extra ? `<span class="calendar-day-extra">${extra}</span>` : ""}
            </div>
        `;
    }

    // Always pad out to exactly 42 cells (6 rows of 7). Without this, a
    // 5-row month (like June) is shorter than a 6-row month (like August),
    // which shifts the footer up/down every time the month changes.
    const totalCellsSoFar = startWeekday + daysInMonth;
    const trailingEmpty = 42 - totalCellsSoFar;
    for (let i = 0; i < trailingEmpty; i++) {
        html += `<div class="calendar-day empty"></div>`;
    }

    html += `</div>`;

    container.innerHTML = html;

    document.getElementById("cal-prev").addEventListener("click", () => {
        const newMonth = month === 0 ? 11 : month - 1;
        const newYear = month === 0 ? year - 1 : year;
        if (onMonthChange) onMonthChange(newYear, newMonth);
        renderCalendar(containerId, newYear, newMonth, bookings, options);
    });

    document.getElementById("cal-next").addEventListener("click", () => {
        const newMonth = month === 11 ? 0 : month + 1;
        const newYear = month === 11 ? year + 1 : year;
        if (onMonthChange) onMonthChange(newYear, newMonth);
        renderCalendar(containerId, newYear, newMonth, bookings, options);
    });

    if (editable && onDayClick) {
        container.querySelectorAll(".calendar-day.editable").forEach(el => {
            el.addEventListener("click", () => onDayClick(el.dataset.date));
        });
    }
}