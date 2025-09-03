const TimeFormat = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const minutesRemaining = minutes % 60;
    return `${hours}h ${minutesRemaining}m`;
};

export default TimeFormat;
