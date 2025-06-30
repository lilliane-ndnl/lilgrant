// Test fetch functionality
async function testFetch() {
  try {
    console.log('🔍 Testing fetch to localhost...');
    
    // Test different possible URLs
    const urls = [
      'http://localhost:5173/data/scholarships.json',
      'http://localhost:3000/data/scholarships.json',
      'http://localhost:5174/data/scholarships.json'
    ];
    
    for (const url of urls) {
      try {
        console.log(`\n📡 Trying: ${url}`);
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Success! Found ${data.length} scholarships`);
          console.log(`📊 First scholarship: ${data[0]?.title || 'No title'}`);
          return;
        } else {
          console.log(`❌ HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n⚠️ None of the URLs worked. Please check if the development server is running.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Add fetch polyfill for Node.js
if (typeof fetch === 'undefined') {
  const { default: fetch } = await import('node-fetch');
  globalThis.fetch = fetch;
}

testFetch(); 