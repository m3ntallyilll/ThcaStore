
#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function checkOrders() {
  try {
    console.log('🔍 Checking for orders...\n');
    
    // First, let's try to get orders (this will show if there are any)
    const response = await fetch(`${BASE_URL}/api/admin/orders`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401) {
      console.log('❌ Need admin authentication to view orders');
      console.log('💡 To check orders, either:');
      console.log('   1. Log into the admin dashboard at /admin');
      console.log('   2. Use the authenticated API with admin token');
      return;
    }
    
    const orders = await response.json();
    
    if (!orders || orders.length === 0) {
      console.log('📝 No orders found in the system');
      console.log('💡 Orders will appear here when customers complete purchases');
    } else {
      console.log(`📊 Found ${orders.length} orders:`);
      orders.forEach((order, index) => {
        console.log(`\n${index + 1}. Order ID: ${order.id}`);
        console.log(`   User ID: ${order.userId}`);
        console.log(`   Total: $${order.total}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking orders:', error.message);
    console.log('\n💡 Make sure your server is running on port 5000');
  }
}

checkOrders();
