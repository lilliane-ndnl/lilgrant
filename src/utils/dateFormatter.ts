export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not Available';
  
  // Handle "Rolling" case
  if (dateString.toLowerCase() === 'rolling') return 'Rolling';

  // Try to parse various date formats
  const dateParts = dateString.split(/[-/]/);
  let date: Date;

  if (dateParts.length === 3) {
    // Handle both MM/DD/YYYY and YYYY-MM-DD formats
    const year = dateParts[2].length === 4 ? dateParts[2] : dateParts[0];
    const month = dateParts[2].length === 4 ? dateParts[0] : dateParts[1];
    const day = dateParts[2].length === 4 ? dateParts[1] : dateParts[2];
    
    date = new Date(Number(year), Number(month) - 1, Number(day));
  } else {
    return dateString; // Return original if we can't parse it
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) return dateString;

  // Format the date as "1 Nov 2024"
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}; 