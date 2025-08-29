import type { Order, OrderItem, Product } from '@shared/schema';

interface InvoiceData {
  order: Order;
  orderItems: (OrderItem & { product: Product })[];
  invoiceNumber: string;
  dueDate: string;
}

export function generateInvoiceHTML(data: InvoiceData): string {
  const { order, orderItems, invoiceNumber, dueDate } = data;
  
  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
  const taxAmount = parseFloat(order.tax || '0');
  const shippingCost = parseFloat(order.shippingCost || '0');
  const storeCreditUsed = parseFloat(order.storeCreditUsed || '0');
  const promoDiscount = parseFloat(order.promoDiscount || '0');
  const total = parseFloat(order.total || '0');

  const invoiceDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #${invoiceNumber} - Mentally-Chill THCA Store</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8fafc;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 20px auto;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .invoice-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .company-logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .company-tagline {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .invoice-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            padding: 30px 40px;
            background: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .invoice-details, .billing-details {
            background: white;
            padding: 20px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 15px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 5px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        
        .detail-label {
            font-weight: 500;
            color: #4a5568;
        }
        
        .detail-value {
            color: #2d3748;
        }
        
        .items-section {
            padding: 30px 40px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        .items-table th {
            background: #667eea;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        
        .items-table td {
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .items-table tr:nth-child(even) {
            background: #f8fafc;
        }
        
        .product-name {
            font-weight: 500;
            color: #2d3748;
        }
        
        .product-details {
            font-size: 12px;
            color: #718096;
            margin-top: 4px;
        }
        
        .totals-section {
            padding: 30px 40px;
            background: #f8fafc;
        }
        
        .totals-table {
            width: 100%;
            max-width: 400px;
            margin-left: auto;
        }
        
        .totals-table td {
            padding: 8px 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .totals-table .total-row {
            font-weight: 600;
            font-size: 18px;
            color: #2d3748;
            border-top: 2px solid #667eea;
            background: white;
        }
        
        .payment-info {
            padding: 30px 40px;
            background: #667eea;
            color: white;
            text-align: center;
        }
        
        .payment-status {
            display: inline-block;
            padding: 8px 20px;
            background: ${order.paymentStatus === 'paid' ? '#48bb78' : '#ed8936'};
            border-radius: 20px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .footer {
            padding: 30px 40px;
            text-align: center;
            background: #2d3748;
            color: white;
        }
        
        .footer-text {
            margin-bottom: 10px;
        }
        
        .contact-info {
            font-size: 14px;
            opacity: 0.8;
        }
        
        @media print {
            body {
                background: white;
            }
            
            .invoice-container {
                box-shadow: none;
                margin: 0;
            }
        }
        
        .discount-row {
            color: #48bb78;
        }
        
        .store-credit-row {
            color: #667eea;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="invoice-header">
            <div class="company-logo">🌿 Mentally-Chill</div>
            <div class="company-tagline">Premium THCA Hemp Products | Lab-Tested Quality</div>
        </div>
        
        <!-- Invoice Information -->
        <div class="invoice-info">
            <div class="invoice-details">
                <h3 class="section-title">Invoice Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Invoice Number:</span>
                    <span class="detail-value">#${invoiceNumber}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Order ID:</span>
                    <span class="detail-value">#${order.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Invoice Date:</span>
                    <span class="detail-value">${invoiceDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Due Date:</span>
                    <span class="detail-value">${dueDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Method:</span>
                    <span class="detail-value">${order.paymentMethod || 'Cash App'}</span>
                </div>
            </div>
            
            <div class="billing-details">
                <h3 class="section-title">Billing Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Customer:</span>
                    <span class="detail-value">${order.billingName || order.shippingName || 'Customer'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${order.billingEmail || order.shippingEmail || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Address:</span>
                    <span class="detail-value">
                        ${order.billingAddress || order.shippingAddress || 'N/A'}<br>
                        ${order.billingCity || order.shippingCity || ''} ${order.billingState || order.shippingState || ''} ${order.billingZip || order.shippingZip || ''}
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${order.billingPhone || order.shippingPhone || 'N/A'}</span>
                </div>
            </div>
        </div>
        
        <!-- Items Section -->
        <div class="items-section">
            <h3 class="section-title">Order Items</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItems.map(item => `
                        <tr>
                            <td>
                                <div class="product-name">${item.product.name}</div>
                                <div class="product-details">
                                    ${item.product.category} • ${item.product.weight || 'N/A'}
                                    ${item.product.thcaContent ? ` • ${item.product.thcaContent}% THCA` : ''}
                                </div>
                            </td>
                            <td>${item.quantity}</td>
                            <td>$${parseFloat(item.product.price).toFixed(2)}</td>
                            <td>$${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <!-- Totals Section -->
        <div class="totals-section">
            <table class="totals-table">
                <tr>
                    <td>Subtotal:</td>
                    <td style="text-align: right;">$${subtotal.toFixed(2)}</td>
                </tr>
                ${promoDiscount > 0 ? `
                <tr class="discount-row">
                    <td>Promo Discount ${order.promoCodeUsed ? `(${order.promoCodeUsed})` : ''}:</td>
                    <td style="text-align: right;">-$${promoDiscount.toFixed(2)}</td>
                </tr>
                ` : ''}
                ${storeCreditUsed > 0 ? `
                <tr class="store-credit-row">
                    <td>Store Credit Applied:</td>
                    <td style="text-align: right;">-$${storeCreditUsed.toFixed(2)}</td>
                </tr>
                ` : ''}
                ${shippingCost > 0 ? `
                <tr>
                    <td>Shipping:</td>
                    <td style="text-align: right;">$${shippingCost.toFixed(2)}</td>
                </tr>
                ` : `
                <tr style="color: #48bb78;">
                    <td>Shipping:</td>
                    <td style="text-align: right;">FREE</td>
                </tr>
                `}
                ${taxAmount > 0 ? `
                <tr>
                    <td>Tax:</td>
                    <td style="text-align: right;">$${taxAmount.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr class="total-row">
                    <td>Total Amount:</td>
                    <td style="text-align: right;">$${total.toFixed(2)}</td>
                </tr>
            </table>
        </div>
        
        <!-- Payment Information -->
        <div class="payment-info">
            <h3 style="margin-bottom: 15px;">Payment Status</h3>
            <div class="payment-status">
                ${order.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
            </div>
            ${order.paymentStatus !== 'paid' ? `
                <p style="margin-top: 15px; opacity: 0.9;">
                    Payment pending confirmation. We'll update your order status once payment is verified.
                </p>
            ` : ''}
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-text">Thank you for choosing Mentally-Chill for your premium THCA needs!</div>
            <div class="contact-info">
                Email: support@mentally-chill.com | Website: mentally-chill.online<br>
                Lab-tested quality • Legal hemp-derived products • Fast shipping
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

export function generateInvoiceNumber(orderId: string): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const orderShort = orderId.slice(0, 6).toUpperCase();
  
  return `MC${year}${month}${day}-${orderShort}`;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const puppeteer = require('puppeteer');
  
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const html = generateInvoiceHTML(data);
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });
    
    await browser.close();
    return pdf;
  } catch (error) {
    console.error('PDF generation error:', error);
    // Fallback to HTML buffer if PDF generation fails
    const html = generateInvoiceHTML(data);
    return Buffer.from(html, 'utf8');
  }
}