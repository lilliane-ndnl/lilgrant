import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Scholarship data from CSV (manually converted for reliability)
const scholarshipsData = [
  {
    "id": "SCH0001",
    "title": "MPOWER Monthly Scholarship - June 2025: Pride Month",
    "amount": "$1,000",
    "awards": "3",
    "deadline": "2025/06/30",
    "sponsors": "MPOWER Financing",
    "description": "Our June scholarship celebrates the accomplishments of the LGBTQ+ community.\nMonthly Scholarships for International Students\n\nWe're thrilled to announce our Monthly Scholarship Series! MPOWER is awarding US$48,000 this year to help 36 international students fund their education dreams.\n\nHow this works:\n- On the first day of each month, check out this page to find out the scholarship theme for the month. \n- You can subscribe to our student newsletter to be alerted when the new scholarship is announced.\n- Be sure to apply quickly! Applications will be open until the last Friday of the month.\nRead below to find out more about this month's scholarship!",
    "eligibilityRequirements": "- Be admitted to, or enrolled in, a full-time degree program at a U.S. or Canadian school that MPOWER supports, and\n- Be an international student permitted to legally study in the U.S. or Canada, as applicable:\n  + For study in the U.S., this means that the applicant meets one of these criteria:\n    - Has a valid visa that permits study in the U.S., or\n    - Is protected under the Deferred Action for Childhood Arrivals (DACA)\n  + For study in Canada, this means the applicant must meet the following criteria:\n    - Has a valid Canadian study permit\n\nU.S. citizens who wish to study in the U.S. and Canadian citizens who wish to study in Canada are not eligible for this scholarship.",
    "studyLevel": "All",
    "fieldOfStudy": "All Fields",
    "country": "USA & Canada",
    "officialLink": "https://www.mpowerfinancing.com/scholarships/monthly-scholarships",
    "additionalNotes": ""
  },
  {
    "id": "SCH0002",
    "title": "MPOWER Global Citizen Scholarship",
    "amount": "$8,000 - $2,000 - $1,000",
    "awards": "N/A",
    "deadline": "2025/07/31",
    "sponsors": "MPOWER Financing",
    "description": "We've intentionally designed the Global Citizen Scholarship to be as broad as possible to match the broad, diverse experiences of international and DACA students. There's no requirement to be an MPOWER borrower to apply!\n\nAt MPOWER, we believe that we're not just expanding access to higher education. We're also creating globally-minded, multi-lingual, culturally-competent graduates poised to take on the world's most pressing problems in science, technology, business, and public policy!\n\nIn recognition of the extraordinary potential of these students, we've created the MPOWER Global Citizen Scholarship. We've intentionally designed this scholarship program to be as broad as possible to match the broad, diverse experiences of international students. There's no requirement to be an MPOWER borrower to apply!\n\nScholarships awarded annually to international and DACA students enrolled at schools MPOWER supports. \n\nAwards:\n\nGrand Prize: $8,000\nFirst Runner-Up: $2,000\nSecond Runner-Up: $1,000",
    "eligibilityRequirements": "- Be accepted at, or enrolled in, a full-time degree program at a U.S. or Canadian school that MPOWER supports, and\n- Be an international student allowed to legally study in the U.S. or Canada, as applicable:\n   + For study in the U.S., this means that the applicant meets one of these criteria:\n       - Has a valid visa that permits study in the U.S.\n       - Is protected under the Deferred Action for Childhood Arrivals (DACA)\n       - Is a U.S. permanent resident (Green Card holder)\n   + For study in Canada, this means the applicant meets one of these criteria:\n       - Is a Canadian permanent resident\n       - Has a valid Canadian study permit\n\nWe have created this scholarship specifically for international and DACA students. Therefore, U.S. citizens wishing to study in the U.S. and Canadian citizens wishing to study in Canada are not eligible for this scholarship.",
    "studyLevel": "All",
    "fieldOfStudy": "All Fields",
    "country": "USA & Canada",
    "officialLink": "https://www.mpowerfinancing.com/scholarships/global-citizen",
    "additionalNotes": ""
  },
  {
    "id": "SCH0003",
    "title": "MPOWER Women in STEM Scholarship",
    "amount": "$5,000 - $2,000 - $1,000",
    "awards": "N/A",
    "deadline": "2025/07/31",
    "sponsors": "MPOWER Financing",
    "description": "We believe in addressing inequality in education. In recognition of the extraordinary potential of women in the sciences, we created the MPOWER Women in STEM Scholarship. You don't need to be an MPOWER borrower to apply! What are you waiting for?\n\nEmpowering women in STEM\n\nIn keeping with MPOWER's commitment to empower high-potential global citizens to realize their educational aspirations – and become tomorrow's leading scientists and innovators – this international scholarship program focuses on women who will use their STEM degree to benefit society and the planet and who have the potential to serve as role models and advocates for women in STEM.\n\nThe National Center for Education Statistics reported that 32% of STEM degrees in the U.S. were awarded to women in one year. Women majoring in computer engineering, nuclear science and software development, amongst others, should not be challenged in funding their dream. In addition, the Society of Women Engineers found that gender inequities are especially pronounced in engineering and computer science, with just 20% of bachelor's degrees in engineering and computer science held by women.\n\nFor MPOWER CEO and Co-founder Manu Smadja, these statistics represent a social challenge to address. \n\n\"It's critical for us as a society to have a meaningful representation of women shaping the science and technology of tomorrow,\" Smadja says. \"The world may look a lot different if we do a better job at enabling female talent to shape the technologies transforming healthcare, education, transportation or cities for instance. \n\n\"By helping talented female students study and work in North America, we're helping close the gender gap in the STEM workforce. But we'd like to do much more, and starting this new scholarship program for women in STEM is yet another way to level the playing field.\"\n\nScholarships awarded annually to international and DACA students enrolled at schools MPOWER supports. \n\nAwards:\n\nGrand Prize: $5,000\nFirst Runner-Up: $2,000\nSecond Runner-Up: $1,000",
    "eligibilityRequirements": "- Be accepted at, or enrolled in, a full-time degree program at a U.S. or Canadian school that MPOWER supports, and\n- Be an international student allowed to legally study in the U.S. or Canada, as applicable:\n   + For study in the U.S., this means that the applicant meets one of these criteria:\n       - Has a valid visa that permits study in the U.S.\n       - Is protected under the Deferred Action for Childhood Arrivals (DACA)\n       - Is a U.S. permanent resident (Green Card holder)\n   + For study in Canada, this means the applicant meets one of these criteria:\n       - Is a Canadian permanent resident\n       - Has a valid Canadian study permit\n\nWe have created this scholarship specifically for international and DACA students. Therefore, U.S. citizens wishing to study in the U.S. and Canadian citizens wishing to study in Canada are not eligible for this scholarship.",
    "studyLevel": "All",
    "fieldOfStudy": "STEM",
    "country": "USA & Canada",
    "officialLink": "https://www.mpowerfinancing.com/scholarships/women-in-stem",
    "additionalNotes": ""
  },
  {
    "id": "SCH0004",
    "title": "MPOWER MBA Scholarship",
    "amount": "$5,000 - $2,000 - $1,000",
    "awards": "N/A",
    "deadline": "2025/07/31",
    "sponsors": "MPOWER Financing",
    "description": "Our newest scholarship is designed specifically for MBA students in the US and Canada.\n\nWe're thrilled to announce our new MBA scholarship! MPOWER will be awarding up to US$10,000 to support international students. You must be pursuing an MBA at an MPOWER-eligible school to apply, but you don't need to be an MPOWER borrower.\n\nAwards:\n\nGrand Prize: US$5,000\nFirst Runner-Up: US$2,000\nSecond Runner-Up: US$1,000",
    "eligibilityRequirements": "- Be admitted to, or enrolled in, a full-time MBA degree program at a U.S. or Canadian school that MPOWER supports, and\n- Be an international student permitted to legally study in the U.S. or Canada, as applicable:\n  + For study in the U.S., this means that the applicant meets one of these criteria:\n    - Has a valid visa that permits study in the U.S., or\n    - Is protected under the Deferred Action for Childhood Arrivals (DACA)\n  + For study in Canada, this means the applicant must meet the following criteria:\n    - Has a valid Canadian study permit\n\nU.S. citizens wishing to study in the U.S. and Canadian citizens wishing to study in Canada are not eligible for this scholarship.",
    "studyLevel": "Master's",
    "fieldOfStudy": "Business",
    "country": "USA & Canada",
    "officialLink": "https://www.mpowerfinancing.com/scholarships/mba-scholarship",
    "additionalNotes": ""
  }
];

// Function to update scholarships.json file
function updateScholarshipsJson() {
  try {
    const jsonPath = path.join(__dirname, '..', 'public', 'data', 'scholarships.json');
    
    // Write the scholarships data to JSON file
    fs.writeFileSync(jsonPath, JSON.stringify(scholarshipsData, null, 2));
    
    console.log(`Successfully updated scholarships.json with ${scholarshipsData.length} scholarships`);
    console.log(`File location: ${jsonPath}`);
    
  } catch (error) {
    console.error('Error updating scholarships.json:', error);
  }
}

// Run the update
updateScholarshipsJson(); 