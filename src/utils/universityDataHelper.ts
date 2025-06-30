/**
 * Helper functions for formatting university data according to the official data dictionary
 */

/**
 * Format the school type based on the CONTROL field
 */
export function formatSchoolType(control: string | number | null | undefined): string {
    if (control === null || control === undefined) return 'N/A';
    const numericControl = parseInt(String(control));
    switch (numericControl) {
        case 1: return 'Public';
        case 2: return 'Private nonprofit';
        case 3: return 'Private for-profit';
        default: return 'N/A';
    }
}

/**
 * Format the locale type based on the LOCALE field
 */
export function formatLocale(locale: string | number | null | undefined): string {
    if (locale === null || locale === undefined) return 'N/A';
    const numericLocale = parseInt(String(locale));
    if (isNaN(numericLocale)) return 'N/A';

    if (numericLocale >= 11 && numericLocale <= 13) return 'City';
    if (numericLocale >= 21 && numericLocale <= 23) return 'Suburb';
    if (numericLocale >= 31 && numericLocale <= 33) return 'Town';
    if (numericLocale >= 41 && numericLocale <= 43) return 'Rural';
    return 'N/A';
}

/**
 * Format the acceptance rate based on the ADM_RATE field
 */
export function formatAcceptanceRate(rate: string | number | null | undefined): string {
    if (rate === null || rate === undefined || String(rate).toUpperCase() === 'NULL') {
        return 'N/A';
    }
    const numericRate = parseFloat(String(rate));
    if (isNaN(numericRate)) {
        return 'N/A';
    }
    return Math.round(numericRate * 100) + '%';
}

/**
 * Get the average annual cost based on the institution's control type and corresponding NPT4 field
 */
export function getAverageAnnualCost(university: any): string {
    if (!university) return 'N/A';

    // First determine the control type to know which field to use
    const control = university.CONTROL;
    if (control === null || control === undefined) return 'N/A';
    
    const numericControl = parseInt(String(control));
    
    // Select the appropriate cost field based on control type
    let cost: string | number | null | undefined;
    if (numericControl === 1) {
        cost = university.NPT4_PUB;
    } else if (numericControl === 2 || numericControl === 3) {
        cost = university.NPT4_PRIV;
    } else {
        return 'N/A';
    }

    // Check for null, undefined, or "NULL" string
    if (cost === null || cost === undefined || String(cost).toUpperCase() === 'NULL') {
        return 'N/A';
    }

    // Convert to number and format
    const numericCost = parseFloat(String(cost));
    if (isNaN(numericCost)) {
        return 'N/A';
    }

    // Format as $XXk
    return `$${Math.round(numericCost / 1000)}k`;
}

/**
 * Format school size category based on the UGDS field
 */
export function formatSizeCategory(size: string | number | null | undefined): string {
    if (size === null || size === undefined || String(size).toUpperCase() === 'NULL') {
        return 'N/A';
    }
    const numericSize = parseFloat(String(size));
    if (isNaN(numericSize)) {
        return 'N/A';
    }
    
    if (numericSize >= 15000) return 'Large';
    if (numericSize >= 5000) return 'Medium';
    return 'Small';
}

/**
 * Format the actual school size number with commas
 */
export function formatSchoolSize(size: string | number | null | undefined): string {
    if (size === null || size === undefined || String(size).toUpperCase() === 'NULL') {
        return 'N/A';
    }
    const numericSize = parseFloat(String(size));
    if (isNaN(numericSize)) {
        return 'N/A';
    }
    return `${Math.round(numericSize).toLocaleString()} students`;
}

/**
 * Format median earnings with proper handling of null/undefined/"NULL"
 */
export function formatMedianEarnings(earnings: string | number | null | undefined): string {
    if (earnings === null || earnings === undefined || String(earnings).toUpperCase() === 'NULL') {
        return 'N/A';
    }
    const numericEarnings = parseFloat(String(earnings));
    if (isNaN(numericEarnings)) {
        return 'N/A';
    }
    return `$${Math.round(numericEarnings / 1000)}k`;
} 