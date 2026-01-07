/**
 * dateHelpers.js
 * Utility functions to calculate date ranges for the filter.
 * All calculations assume "Today" is based on current system time (local).
 */

export const getRanges = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day local time

    // Helpers to create new date instances relative to 'today'
    const addDays = (d, days) => {
        const newDate = new Date(d);
        newDate.setDate(d.getDate() + days);
        return newDate;
    };

    // --- RANGE CALCULATIONS ---

    // 1. TODAY
    const todayStart = new Date(today);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    // 2. TOMORROW
    const tmrStart = addDays(today, 1);
    const tmrEnd = new Date(tmrStart);
    tmrEnd.setHours(23, 59, 59, 999);

    // 3. YESTERDAY
    const yestStart = addDays(today, -1);
    const yestEnd = new Date(yestStart);
    yestEnd.setHours(23, 59, 59, 999);

    // 4. THIS WEEK (Mon - Sun)
    // getDay(): 0 = Sun, 1 = Mon ... 6 = Sat
    const currentDay = today.getDay();
    // Calculate distance to previous Monday. 
    // If today is Sunday (0), distance is -6. If Monday (1), distance is 0.
    // If today is Tuesday (2), distance is -1.
    const distToMon = currentDay === 0 ? -6 : 1 - currentDay;

    const thisWeekStart = addDays(today, distToMon);
    const thisWeekEnd = addDays(thisWeekStart, 6);
    thisWeekEnd.setHours(23, 59, 59, 999);

    // 5. NEXT WEEK
    const nextWeekStart = addDays(thisWeekStart, 7);
    const nextWeekEnd = addDays(nextWeekStart, 6);
    nextWeekEnd.setHours(23, 59, 59, 999);

    // 6. LAST WEEK
    const lastWeekStart = addDays(thisWeekStart, -7);
    const lastWeekEnd = addDays(lastWeekStart, 6);
    lastWeekEnd.setHours(23, 59, 59, 999);

    // 7. THIS MONTH
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of month
    thisMonthEnd.setHours(23, 59, 59, 999);

    // 8. NEXT MONTH
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    nextMonthEnd.setHours(23, 59, 59, 999);

    // 9. LAST MONTH
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    lastMonthEnd.setHours(23, 59, 59, 999);

    return {
        today: { start: todayStart, end: todayEnd },
        tomorrow: { start: tmrStart, end: tmrEnd },
        yesterday: { start: yestStart, end: yestEnd },
        this_week: { start: thisWeekStart, end: thisWeekEnd },
        next_week: { start: nextWeekStart, end: nextWeekEnd },
        last_week: { start: lastWeekStart, end: lastWeekEnd },
        this_month: { start: thisMonthStart, end: thisMonthEnd },
        next_month: { start: nextMonthStart, end: nextMonthEnd },
        last_month: { start: lastMonthStart, end: lastMonthEnd },
    };
};
