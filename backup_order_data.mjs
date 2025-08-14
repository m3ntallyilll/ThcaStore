import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import fs from 'fs';
import path from 'path';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function backupOrderData() {
  try {
    console.log('🔄 Starting comprehensive order data backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = 'order_backups';
    
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    // Backup all orders with complete details
    console.log('📦 Backing up orders...');
    const ordersResult = await sql`
      SELECT 
        id, user_id, status, subtotal, shipping_cost, tax, total,
        shipping_method, tracking_number, estimated_delivery,
        shipping_name, shipping_email, shipping_phone,
        shipping_address, shipping_address2, shipping_city,
        shipping_state, shipping_zip, shipping_country,
        payment_status, promo_code_used, promo_discount, affiliate_code,
        store_credit_used, cash_app_amount, payment_method,
        billing_name, billing_email, billing_address, billing_city,
        billing_state, billing_zip, billing_phone, product_names,
        created_at
      FROM orders 
      ORDER BY created_at DESC
    `;
    
    // Backup all order items with product details
    console.log('📦 Backing up order items...');
    const orderItemsResult = await sql`
      SELECT 
        oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price,
        p.name as product_name, p.category as product_category,
        p.weight as product_weight, p.thca_content
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      ORDER BY oi.order_id
    `;
    
    // Backup user information for orders (without passwords)
    console.log('👤 Backing up user data for orders...');
    const usersWithOrdersResult = await sql`
      SELECT DISTINCT
        u.id, u.username, u.email, u.first_name, u.last_name,
        u.created_at, u.store_credit
      FROM users u
      INNER JOIN orders o ON u.id = o.user_id
      ORDER BY u.created_at
    `;
    
    // Backup point transactions related to orders
    console.log('🎯 Backing up point transactions...');
    const pointTransactionsResult = await sql`
      SELECT 
        id, user_id, points, type, description, order_id, created_at
      FROM point_transactions
      WHERE order_id IS NOT NULL
      ORDER BY created_at DESC
    `;
    
    // Create comprehensive backup object
    const backupData = {
      metadata: {
        backup_date: new Date().toISOString(),
        total_orders: ordersResult.length,
        total_order_items: orderItemsResult.length,
        total_users_with_orders: usersWithOrdersResult.length,
        total_point_transactions: pointTransactionsResult.length,
        backup_version: '1.0'
      },
      orders: ordersResult,
      order_items: orderItemsResult,
      users_with_orders: usersWithOrdersResult,
      point_transactions: pointTransactionsResult
    };
    
    // Write comprehensive backup file
    const backupFileName = `order_data_backup_${timestamp}.json`;
    const backupFilePath = path.join(backupDir, backupFileName);
    
    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));
    
    // Create SQL restore script
    console.log('📝 Creating SQL restore script...');
    let sqlScript = `-- Order Data Restore Script\n-- Generated: ${new Date().toISOString()}\n\n`;
    
    // Add orders
    if (ordersResult.length > 0) {
      sqlScript += `-- Restore Orders\n`;
      for (const order of ordersResult) {
        sqlScript += `INSERT INTO orders (id, user_id, status, subtotal, shipping_cost, tax, total, shipping_method, tracking_number, estimated_delivery, shipping_name, shipping_email, shipping_phone, shipping_address, shipping_address2, shipping_city, shipping_state, shipping_zip, shipping_country, payment_status, promo_code_used, promo_discount, affiliate_code, store_credit_used, cash_app_amount, payment_method, billing_name, billing_email, billing_address, billing_city, billing_state, billing_zip, billing_phone, product_names, created_at) VALUES (`;
        sqlScript += `'${order.id}', '${order.user_id}', '${order.status}', '${order.subtotal}', '${order.shipping_cost}', '${order.tax}', '${order.total}', '${order.shipping_method}', ${order.tracking_number ? `'${order.tracking_number}'` : 'NULL'}, ${order.estimated_delivery ? `'${order.estimated_delivery}'` : 'NULL'}, '${order.shipping_name}', '${order.shipping_email}', ${order.shipping_phone ? `'${order.shipping_phone}'` : 'NULL'}, '${order.shipping_address}', ${order.shipping_address2 ? `'${order.shipping_address2}'` : 'NULL'}, '${order.shipping_city}', '${order.shipping_state}', '${order.shipping_zip}', '${order.shipping_country}', '${order.payment_status}', ${order.promo_code_used ? `'${order.promo_code_used}'` : 'NULL'}, ${order.promo_discount ? `'${order.promo_discount}'` : 'NULL'}, ${order.affiliate_code ? `'${order.affiliate_code}'` : 'NULL'}, ${order.store_credit_used ? `'${order.store_credit_used}'` : 'NULL'}, ${order.cash_app_amount ? `'${order.cash_app_amount}'` : 'NULL'}, ${order.payment_method ? `'${order.payment_method}'` : 'NULL'}, ${order.billing_name ? `'${order.billing_name}'` : 'NULL'}, ${order.billing_email ? `'${order.billing_email}'` : 'NULL'}, ${order.billing_address ? `'${order.billing_address}'` : 'NULL'}, ${order.billing_city ? `'${order.billing_city}'` : 'NULL'}, ${order.billing_state ? `'${order.billing_state}'` : 'NULL'}, ${order.billing_zip ? `'${order.billing_zip}'` : 'NULL'}, ${order.billing_phone ? `'${order.billing_phone}'` : 'NULL'}, ${order.product_names ? `'${order.product_names}'` : 'NULL'}, '${order.created_at}');\n`;
      }
    }
    
    // Add order items
    if (orderItemsResult.length > 0) {
      sqlScript += `\n-- Restore Order Items\n`;
      for (const item of orderItemsResult) {
        sqlScript += `INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES ('${item.id}', '${item.order_id}', '${item.product_id}', ${item.quantity}, '${item.price}');\n`;
      }
    }
    
    const sqlFileName = `order_data_restore_${timestamp}.sql`;
    const sqlFilePath = path.join(backupDir, sqlFileName);
    fs.writeFileSync(sqlFilePath, sqlScript);
    
    // Create summary report
    const summaryReport = {
      backup_summary: {
        timestamp: new Date().toISOString(),
        files_created: [backupFileName, sqlFileName],
        orders_backed_up: ordersResult.length,
        order_items_backed_up: orderItemsResult.length,
        users_with_orders: usersWithOrdersResult.length,
        point_transactions: pointTransactionsResult.length,
        backup_location: backupDir,
        total_revenue: ordersResult.reduce((sum, order) => sum + parseFloat(order.total || '0'), 0),
        order_statuses: ordersResult.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {}),
        date_range: {
          first_order: ordersResult.length > 0 ? ordersResult[ordersResult.length - 1]?.created_at : null,
          last_order: ordersResult.length > 0 ? ordersResult[0]?.created_at : null
        }
      }
    };
    
    const summaryFileName = `backup_summary_${timestamp}.json`;
    const summaryFilePath = path.join(backupDir, summaryFileName);
    fs.writeFileSync(summaryFilePath, JSON.stringify(summaryReport, null, 2));
    
    console.log('\n✅ Order data backup completed successfully!');
    console.log(`📁 Backup directory: ${backupDir}/`);
    console.log(`📋 Files created:`);
    console.log(`   • ${backupFileName} - Complete JSON backup`);
    console.log(`   • ${sqlFileName} - SQL restore script`);
    console.log(`   • ${summaryFileName} - Backup summary report`);
    console.log(`\n📊 Backup Statistics:`);
    console.log(`   • Orders: ${ordersResult.length}`);
    console.log(`   • Order Items: ${orderItemsResult.length}`);
    console.log(`   • Users with Orders: ${usersWithOrdersResult.length}`);
    console.log(`   • Point Transactions: ${pointTransactionsResult.length}`);
    if (ordersResult.length > 0) {
      console.log(`   • Total Revenue: $${summaryReport.backup_summary.total_revenue.toFixed(2)}`);
      console.log(`   • Order Statuses:`, summaryReport.backup_summary.order_statuses);
    }
    
    return {
      success: true,
      files: [backupFileName, sqlFileName, summaryFileName],
      statistics: summaryReport.backup_summary
    };
    
  } catch (error) {
    console.error('❌ Error backing up order data:', error);
    return { success: false, error: error.message };
  }
}

backupOrderData();