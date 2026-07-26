function formatDate(date) {
    return date.toISOString().split("T")[0];
}

function isDateBooked(dateStr, bookings) {
    return bookings.some(b => dateStr >= b.start_date && dateStr <= b.end_date);
}

export function renderCalendar(containerId, year, month, bookings, options = {}) {
    const { editable = false, onDayClick = null, onMonthChange = null } = options;

    const container = document.getElementById(containerId);

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay(); // 0 = Sunday

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

    // Empty cells before the 1st
    for (let i = 0; i < startWeekday; i++) {
        html += `<div class="calendar-day empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDate(date);
        const booked = isDateBooked(dateStr, bookings);

        const classes = ["calendar-day"];
        if (booked) classes.push("booked");
        if (editable) classes.push("editable");

        html += `<div class="${classes.join(" ")}" data-date="${dateStr}">${day}</div>`;
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