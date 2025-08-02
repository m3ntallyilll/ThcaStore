#!/usr/bin/env node
// Simple cart functionality test

console.log('🛒 Testing Cart Functionality...');

async function testCartAPI() {
  const baseUrl = 'http://localhost:5000';
  
  // Test login first to get authentication token
  console.log('1. Testing authentication...');
  try {
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@thca-store.com',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      return;
    }
    
    const { token } = await loginResponse.json();
    console.log('✅ Login successful');
    
    // Test fetching cart (should be empty initially)
    console.log('2. Testing cart fetch...');
    const cartResponse = await fetch(`${baseUrl}/api/cart`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (cartResponse.ok) {
      const cartItems = await cartResponse.json();
      console.log(`✅ Cart fetch successful - ${cartItems.length} items`);
    } else {
      console.log('❌ Cart fetch failed');
    }
    
    // Test adding item to cart
    console.log('3. Testing add to cart...');
    const addResponse = await fetch(`${baseUrl}/api/cart`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: 'test-product-id',
        quantity: 1
      })
    });
    
    if (addResponse.ok) {
      console.log('✅ Add to cart successful');
    } else {
      const error = await addResponse.text();
      console.log(`❌ Add to cart failed: ${error}`);
    }
    
    console.log('🎉 Cart functionality test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCartAPI();