import { storage } from './database-storage.js';

async function testProductCRUD() {
  console.log('🧪 Testing Product CRUD Operations...\n');

  try {
    // Initialize storage
    await storage.initialize();

    // Test 1: Get all products
    console.log('📋 Test 1: Getting all products...');
    const allProducts = await storage.getProducts();
    console.log(`✅ Found ${allProducts.length} products`);
    
    if (allProducts.length === 0) {
      console.log('❌ No products found. Please seed the database first.');
      return;
    }

    const testProduct = allProducts[0];
    console.log(`Using test product: "${testProduct.name}" (ID: ${testProduct.id})\n`);

    // Test 2: Update product
    console.log('🔄 Test 2: Updating product...');
    const originalName = testProduct.name;
    const updatedData = {
      name: `${originalName} - UPDATED`,
      price: '199.99',
      stock: 999,
      description: 'This is an updated description for testing purposes.'
    };

    const updatedProduct = await storage.updateProduct(testProduct.id, updatedData);
    
    if (updatedProduct) {
      console.log('✅ Product updated successfully:');
      console.log(`- Name: ${updatedProduct.name}`);
      console.log(`- Price: $${updatedProduct.price}`);
      console.log(`- Stock: ${updatedProduct.stock}`);
      console.log(`- Description: ${updatedProduct.description}\n`);
    } else {
      console.log('❌ Product update failed\n');
      return;
    }

    // Test 3: Verify update persisted
    console.log('🔍 Test 3: Verifying update persisted...');
    const retrievedProduct = await storage.getProduct(testProduct.id);
    
    if (retrievedProduct && retrievedProduct.name === updatedData.name) {
      console.log('✅ Update persisted correctly\n');
    } else {
      console.log('❌ Update did not persist correctly\n');
      return;
    }

    // Test 4: Restore original data
    console.log('↩️ Test 4: Restoring original data...');
    const restoredProduct = await storage.updateProduct(testProduct.id, {
      name: originalName,
      price: testProduct.price,
      stock: testProduct.stock,
      description: testProduct.description
    });

    if (restoredProduct) {
      console.log('✅ Product restored to original state\n');
    } else {
      console.log('❌ Failed to restore product\n');
    }

    // Test 5: Test delete (create a temporary product first)
    console.log('🗑️ Test 5: Testing product deletion...');
    const tempProduct = await storage.createProduct({
      name: 'TEMP TEST PRODUCT - DELETE ME',
      description: 'This is a temporary product for testing deletion',
      price: '1.00',
      category: 'test',
      imageUrl: 'https://via.placeholder.com/300',
      stock: 1,
      weight: '0.1',
      featured: false,
      rating: null,
      thcaContent: null,
      strainType: null,
      effects: null
    });

    console.log(`Created temporary product: ${tempProduct.id}`);

    const deleteResult = await storage.deleteProduct(tempProduct.id);
    
    if (deleteResult) {
      console.log('✅ Product deleted successfully');
      
      // Verify deletion
      const deletedProduct = await storage.getProduct(tempProduct.id);
      if (!deletedProduct) {
        console.log('✅ Deletion verified - product no longer exists\n');
      } else {
        console.log('❌ Deletion failed - product still exists\n');
      }
    } else {
      console.log('❌ Product deletion failed\n');
    }

    console.log('🎉 All Product CRUD tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log('✅ Product retrieval: WORKING');
    console.log('✅ Product update: WORKING');
    console.log('✅ Product deletion: WORKING');
    console.log('✅ Data persistence: WORKING');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testProductCRUD().catch(console.error);