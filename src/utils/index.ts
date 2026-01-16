/**
 * Shared Utility Functions
 */

/**
 * Formats a number as INR currency
 * @param amount Number to format
 * @returns Formatted string (e.g. "₹250")
 */
export const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Formats a duration in minutes to a readable string
 * @param minutes Number of minutes
 * @returns String (e.g. "30-40 min")
 */
export const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
};

/**
 * Generates a random ID
 */
export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

/**
 * Simulation delay for mock async operations
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
