import dotenv from "dotenv";
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

async function testAPIConnection() {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error('API_KEY not found in environment variables');
  }

  console.log('🔍 Testing College Scorecard API connection...');
  
  const baseUrl = 'https://api.data.gov/ed/collegescorecard/v1/schools';
  const params = new URLSearchParams({
    'api_key': apiKey,
    'fields': 'id,school.name',
    'per_page': '1',
    'page': '0'
  });

  try {
    console.log('📡 Making test API request...');
    const response = await fetch(`${baseUrl}?${params}`);
    
    console.log(`📊 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ API connection successful!');
    console.log(`📈 Total universities available: ${data.metadata.total}`);
    console.log(`📝 Sample university: ${data.results[0]['school.name']}`);
    
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
    return false;
  }
}

testAPIConnection(); 