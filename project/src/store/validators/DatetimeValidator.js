class DatetimeValidator {
    /**
     * Validates if the input is a valid ISO 8601 date string.
     * @param {string} isoDate - The ISO 8601 date string to validate.
     * @returns {boolean} - True if valid, otherwise false.
     */
    isValidISODate(isoDate) {
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
        return isoDateRegex.test(isoDate) && !isNaN(new Date(isoDate).getTime());
    }

    /**
     * Converts an ISO 8601 date string to the format 'DD.MM.YYYY HH:mm'.
     * @param {string} isoDate - The ISO 8601 date string.
     * @returns {string} - The formatted date string.
     * @throws {Error} - If the input is not a valid ISO 8601 date string.
     */
    formatToCustom(isoDate) {
        if (!this.isValidISODate(isoDate)) {
            throw new Error("Invalid ISO 8601 date string");
        }

        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    /**
     * Checks if the input date is in the past.
     * @param {string} isoDate - The ISO 8601 date string.
     * @returns {boolean} - True if the date is in the past, otherwise false.
     */
    isPastDate(isoDate) {
        if (!this.isValidISODate(isoDate)) {
            throw new Error("Invalid ISO 8601 date string");
        }
        const now = new Date();
        const inputDate = new Date(isoDate);
        return inputDate < now;
    }

    /**
     * Checks if the input date is in the future.
     * @param {string} isoDate - The ISO 8601 date string.
     * @returns {boolean} - True if the date is in the future, otherwise false.
     */
    isFutureDate(isoDate) {
        if (!this.isValidISODate(isoDate)) {
            throw new Error("Invalid ISO 8601 date string");
        }
        const now = new Date();
        const inputDate = new Date(isoDate);
        return inputDate > now;
    }

    /**
     * Validates if the input date falls within a specified range.
     * @param {string} isoDate - The ISO 8601 date string.
     * @param {string} startDate - The ISO 8601 start date string.
     * @param {string} endDate - The ISO 8601 end date string.
     * @returns {boolean} - True if the date is within the range, otherwise false.
     */
    isWithinRange(isoDate, startDate, endDate) {
        if (!this.isValidISODate(isoDate) || !this.isValidISODate(startDate) || !this.isValidISODate(endDate)) {
            throw new Error("Invalid ISO 8601 date string");
        }

        const inputDate = new Date(isoDate);
        const start = new Date(startDate);
        const end = new Date(endDate);

        return inputDate >= start && inputDate <= end;
    }
}