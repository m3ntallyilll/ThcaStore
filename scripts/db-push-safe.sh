#!/bin/bash

# Safe database push script with backup
# This ensures blog data persists through deployments

echo "🔄 Starting safe database schema push..."

# Create backup before schema changes
echo "📦 Creating backup before schema push..."
node backup_blog_data.mjs

# Push schema changes
echo "📤 Pushing schema changes..."
npm run db:push

# Verify data integrity after push
echo "🔍 Verifying data integrity..."
node -e "
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

async function verify() {
  try {
    const result = await sql\`SELECT COUNT(*) as count FROM blog_posts WHERE is_ai_generated = true\`;
    console.log(\`✅ Verified: \${result[0].count} AI-generated blogs in database\`);
    
    const categories = await sql\`SELECT category, COUNT(*) as count FROM blog_posts GROUP BY category\`;
    console.log('📊 Categories:');
    categories.forEach(cat => console.log(\`   \${cat.category}: \${cat.count}\`));
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verify();
"

echo "✅ Safe database push completed!"