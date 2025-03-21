export const formatDateInPHTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'Asia/Manila', // Set timezone to Philippines
    }).format(date);
};

export const getTimeComponents = (dateString: string) => {
    const date = new Date(dateString);
    return {
        day: date.getDate(),
        dayName: date.toLocaleDateString('en-PH', { weekday: 'long' }),
        month: date.toLocaleDateString('en-PH', { month: 'long' }),
        year: date.getFullYear(),
        time: date.toLocaleTimeString('en-PH', { hour: 'numeric', minute: 'numeric', hour12: true })
    };
};