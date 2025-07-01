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
 * Format school size category based on the UGDS field with updated thresholds
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
    if (numericSize >= 2000) return 'Medium';
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

/**
 * Format earnings with proper handling of PrivacySuppressed and invalid values
 */
export function formatEarnings(earning: string | number | null | undefined): string {
    // Handle null, undefined, and "PrivacySuppressed" strings
    if (!earning || typeof earning === 'string' && earning.toLowerCase() === 'privacysuppressed') {
        return 'N/A';
    }

    const numericEarning = parseFloat(String(earning));

    if (isNaN(numericEarning)) {
        return 'N/A';
    }

    return `$${numericEarning.toLocaleString()}`;
}

export function getReligiousAffiliation(code: string | number | null | undefined): string | null {
  if (!code || code === -2 || code === -1 || code === 0) return null;
  
  const affiliationMap: { [key: number]: string } = {
    22: "Roman Catholic",
    24: "Jewish",
    30: "United Methodist",
    52: "Lutheran Church",
    54: "Presbyterian Church",
    23: "Baptist",
    27: "Methodist",
    28: "Lutheran",
    33: "Christian Reformed Church",
    34: "Reformed Church",
    35: "Disciples of Christ",
    36: "Church of Christ",
    37: "Church of God",
    38: "Seventh Day Adventists",
    39: "Other Protestant",
    40: "Multiple Protestant Denominations",
    41: "Other Christian",
    42: "Orthodox",
    43: "Islamic",
    44: "Other Non-Christian",
    51: "Evangelical Lutheran",
    57: "Episcopal Church",
    61: "Greek Orthodox",
    81: "Mennonite",
    99: "Other (none of the above)"
  };

  const numericCode = typeof code === 'string' ? parseInt(code) : code;
  return affiliationMap[numericCode] || null;
}

export const formatFullStateName = (stateAbbr: string | undefined): string => {
  if (!stateAbbr) return '';
  
  const stateNames: { [key: string]: string } = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
  };
  
  return stateNames[stateAbbr] || stateAbbr;
};

/**
 * Format the region based on the REGION code
 */
export function formatRegion(regionCode: string | number | null | undefined): string {
    if (regionCode === null || regionCode === undefined) return 'N/A';
    
    const code = parseInt(String(regionCode));
    if (isNaN(code)) return 'N/A';

    const regionMap: { [key: number]: string } = {
        0: 'U.S. Service Schools',
        1: 'New England',
        2: 'Mid-Atlantic',
        3: 'Great Lakes',
        4: 'Plains',
        5: 'Southeast',
        6: 'Southwest',
        7: 'Rocky Mountains',
        8: 'Far West',
        9: 'Outlying Areas'
    };

    return regionMap[code] || 'N/A';
} 