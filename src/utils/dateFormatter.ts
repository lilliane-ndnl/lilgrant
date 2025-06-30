export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    // Handle different date formats (YYYY/MM/DD, YYYY-MM-DD)
    const normalizedDateString = dateString.replace(/\//g, '-');
    const date = new Date(normalizedDateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date format:", dateString);
      return dateString; // Fallback to original if parsing fails
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Fallback to original if parsing fails
  }
}; 