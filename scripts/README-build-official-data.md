# LilGrant Official Data Builder

This script processes university data from the existing College Scorecard CSV and supplements it with API calls for complete data when needed.

## Features

- **CSV-First Approach**: Uses existing CSV data as primary source (much faster than API calls)
- **Strict Data Filtering**: Only processes institutions that offer Associate's, Bachelor's, and Graduate degrees (excludes certificate-only institutions)
- **Smart API Integration**: Fetches additional details via API only when needed
- **Robust Error Handling**: Implements retry logic for rate limits and network errors
- **Resumable Processing**: Skips already completed schools, allowing you to resume interrupted runs
- **Progress Tracking**: Detailed logging with progress bars and statistics
- **API Rate Limit Respect**: Built-in delays and retry mechanisms

## Prerequisites

1. **Node.js** (v16 or higher)
2. **College Scorecard API Key** (free from https://api.data.gov/signup/)
3. **Existing CSV Data**: The script expects `scripts/data_source/Most-Recent-Cohorts-Institution_05192025.csv`

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the project root with:
   ```
   COLLEGE_SCORECARD_API_KEY=your_api_key_here
   ```

3. **Ensure CSV data exists**:
   The script expects the College Scorecard CSV file at:
   `scripts/data_source/Most-Recent-Cohorts-Institution_05192025.csv`

## Usage

Run the script:
```bash
npm run build-data
```

Or directly:
```bash
node scripts/build-official-data.js
```

## How It Works

1. **CSV Processing**: Reads the existing College Scorecard CSV file
2. **Filtering**: Extracts only degree-granting institutions (PREDDEG values 2, 3, 4)
3. **Resume Check**: Identifies already processed institutions
4. **API Enhancement**: Makes targeted API calls to get additional details
5. **Data Storage**: Saves each institution as a separate JSON file

## Output

The script creates individual JSON files in `public/data/details/` with the format:
- Filename: `{institution_id}.json`
- Content: Complete institution data (CSV + API data)

## Data Filtering

The script filters for institutions with:
- **PREDDEG = 2**: Predominantly associate's-degree granting
- **PREDDEG = 3**: Predominantly bachelor's-degree granting  
- **PREDDEG = 4**: Entirely graduate-degree granting

This excludes certificate-only institutions (PREDDEG = 1).

## Performance

- **Fast Processing**: CSV-first approach means minimal API calls
- **Rate Limit Friendly**: Only makes API calls when needed
- **Resumable**: Can be stopped and restarted without losing progress
- **Efficient**: Processes ~3,700+ institutions efficiently

## Error Handling

- **API Failures**: Continues processing even if individual API calls fail
- **Rate Limiting**: Automatically retries with exponential backoff
- **Network Issues**: Graceful handling of connection problems
- **Data Validation**: Ensures data integrity throughout the process

## Monitoring

The script provides detailed progress updates including:
- Total institutions found
- Processing progress
- API call count
- Error tracking
- Time elapsed

## Troubleshooting

**API Key Issues**:
- Ensure your API key is valid and has sufficient quota
- Check the `.env` file is in the correct location

**CSV File Issues**:
- Verify the CSV file exists at the expected path
- Ensure the file has the correct format and headers

**Rate Limiting**:
- The script automatically handles rate limits
- If you hit limits frequently, the script will slow down automatically

**Memory Issues**:
- The script processes data in streams to minimize memory usage
- For very large datasets, consider processing in batches

## Expected Results

After successful completion, you should have:
- ~3,700+ JSON files in `public/data/details/`
- Each file containing complete institution data
- Comprehensive dataset ready for LilGrant application use

## Data Quality

The resulting dataset includes:
- Basic institution information (name, location, type)
- Academic data (degrees offered, enrollment, etc.)
- Financial information (costs, aid, etc.)
- Additional API-enhanced data when available 