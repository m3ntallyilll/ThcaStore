#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Database connection
const sql = neon(process.env.DATABASE_URL);

async function backupBlogData() {
  try {
    console.log('📦 Starting blog data backup...');
    
    // Get all blog posts
    const blogs = await sql`
      SELECT * FROM blog_posts 
      ORDER BY created_at DESC
    `;
    
    console.log(`📊 Found ${blogs.length} blog posts to backup`);
    
    // Create backup directory
    const backupDir = './blog_backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Create timestamped backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `blog_backup_${timestamp}.json`);
    
    // Save backup
    const backupData = {
      timestamp: new Date().toISOString(),
      total_blogs: blogs.length,
      blogs: blogs.map(blog => ({
        ...blog,
        created_at: blog.created_at?.toISOString(),
        updated_at: blog.updated_at?.toISOString(),
        published_at: blog.published_at?.toISOString()
      }))
    };
    
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    
    console.log(`✅ Backup saved to: ${backupFile}`);
    
    // Create deployment-ready SQL script
    const sqlScript = generateSQLRestoreScript(blogs);
    const sqlFile = path.join(backupDir, `restore_blogs_${timestamp}.sql`);
    fs.writeFileSync(sqlFile, sqlScript);
    
    console.log(`✅ SQL restore script saved to: ${sqlFile}`);
    
    // Generate summary
    const categories = {};
    blogs.forEach(blog => {
      categories[blog.category] = (categories[blog.category] || 0) + 1;
    });
    
    console.log('\n📈 Backup Summary:');
    console.log(`Total blogs: ${blogs.length}`);
    console.log(`AI Generated: ${blogs.filter(b => b.is_ai_generated).length}`);
    console.log(`Published: ${blogs.filter(b => b.status === 'published').length}`);
    console.log('\nBy Category:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
    
    return { backupFile, sqlFile, totalBlogs: blogs.length };
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  }
}

function generateSQLRestoreScript(blogs) {
  let script = `-- Blog Posts Restore Script
-- Generated: ${new Date().toISOString()}
-- Total Records: ${blogs.length}

-- Clear existing blog posts (optional)
-- DELETE FROM blog_posts WHERE is_ai_generated = true;

`;

  blogs.forEach(blog => {
    const values = [
      `'${blog.id}'`,
      `'${blog.title.replace(/'/g, "''")}'`,
      `'${blog.slug}'`,
      `'${blog.content.replace(/'/g, "''")}'`,
      blog.excerpt ? `'${blog.excerpt.replace(/'/g, "''")}'` : 'NULL',
      blog.meta_title ? `'${blog.meta_title.replace(/'/g, "''")}'` : 'NULL',
      blog.meta_description ? `'${blog.meta_description.replace(/'/g, "''")}'` : 'NULL',
      blog.keywords ? `ARRAY[${blog.keywords.map(k => `'${k}'`).join(',')}]` : 'NULL',
      blog.featured_image ? `'${blog.featured_image}'` : 'NULL',
      `'${blog.author_id}'`,
      `'${blog.category}'`,
      blog.tags ? `ARRAY[${blog.tags.map(t => `'${t}'`).join(',')}]` : 'NULL',
      `'${blog.status}'`,
      blog.is_ai_generated || false,
      blog.read_time || 'NULL',
      blog.view_count || 0,
      blog.published_at ? `'${blog.published_at.toISOString()}'` : 'NULL',
      `'${blog.created_at.toISOString()}'`,
      `'${blog.updated_at.toISOString()}'`
    ];

    script += `INSERT INTO blog_posts (
  id, title, slug, content, excerpt, meta_title, meta_description, keywords,
  featured_image, author_id, category, tags, status, is_ai_generated,
  read_time, view_count, published_at, created_at, updated_at
) VALUES (${values.join(', ')})
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  keywords = EXCLUDED.keywords,
  featured_image = EXCLUDED.featured_image,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  read_time = EXCLUDED.read_time,
  view_count = EXCLUDED.view_count,
  published_at = EXCLUDED.published_at,
  updated_at = EXCLUDED.updated_at;

`;
  });

  return script;
}

async function createLinkPyramidStructure() {
  try {
    console.log('\n🔗 Creating SEO link pyramid structure...');
    
    // Get all published blogs
    const blogs = await sql`
      SELECT id, title, slug, category, keywords, content
      FROM blog_posts 
      WHERE status = 'published'
      ORDER BY created_at DESC
    `;
    
    // Create internal linking strategy
    const linkPyramid = {
      tier1_cornerstone: [], // Main category pages
      tier2_pillar: [],      // Supporting content
      tier3_supporting: []    // Detail content
    };
    
    // Categorize content by importance/length
    blogs.forEach(blog => {
      const wordCount = blog.content.length / 5; // Rough word count
      
      if (wordCount > 2000 && ['education', 'health', 'legal'].includes(blog.category)) {
        linkPyramid.tier1_cornerstone.push(blog);
      } else if (wordCount > 1000 && ['products', 'guides'].includes(blog.category)) {
        linkPyramid.tier2_pillar.push(blog);
      } else {
        linkPyramid.tier3_supporting.push(blog);
      }
    });
    
    // Generate linking recommendations
    const linkingStrategy = {
      timestamp: new Date().toISOString(),
      total_blogs: blogs.length,
      pyramid_structure: {
        tier1_count: linkPyramid.tier1_cornerstone.length,
        tier2_count: linkPyramid.tier2_pillar.length,
        tier3_count: linkPyramid.tier3_supporting.length
      },
      linking_recommendations: generateLinkingRecommendations(linkPyramid),
      seo_optimization: {
        internal_links_per_post: 3-5,
        anchor_text_strategy: 'keyword_focused',
        link_distribution: 'pyramid_weighted'
      }
    };
    
    // Save linking strategy
    fs.writeFileSync('./blog_backups/seo_link_pyramid.json', JSON.stringify(linkingStrategy, null, 2));
    
    console.log('✅ SEO link pyramid structure created');
    console.log(`   Tier 1 (Cornerstone): ${linkPyramid.tier1_cornerstone.length} posts`);
    console.log(`   Tier 2 (Pillar): ${linkPyramid.tier2_pillar.length} posts`);
    console.log(`   Tier 3 (Supporting): ${linkPyramid.tier3_supporting.length} posts`);
    
    return linkingStrategy;
    
  } catch (error) {
    console.error('❌ Link pyramid creation failed:', error);
    throw error;
  }
}

function generateLinkingRecommendations(pyramid) {
  const recommendations = [];
  
  // Tier 3 should link up to Tier 2
  pyramid.tier3_supporting.forEach(post => {
    const relatedPillar = pyramid.tier2_pillar.find(pillar => 
      pillar.category === post.category || 
      pillar.keywords.some(k => post.keywords.includes(k))
    );
    
    if (relatedPillar) {
      recommendations.push({
        from: post.slug,
        to: relatedPillar.slug,
        anchor_text: `Learn more about ${relatedPillar.title.split(':')[0]}`,
        type: 'tier3_to_tier2'
      });
    }
  });
  
  // Tier 2 should link up to Tier 1
  pyramid.tier2_pillar.forEach(post => {
    const relatedCornerstone = pyramid.tier1_cornerstone.find(corner => 
      corner.category === post.category ||
      corner.keywords.some(k => post.keywords.includes(k))
    );
    
    if (relatedCornerstone) {
      recommendations.push({
        from: post.slug,
        to: relatedCornerstone.slug,
        anchor_text: `Complete guide to ${relatedCornerstone.title.split(':')[0]}`,
        type: 'tier2_to_tier1'
      });
    }
  });
  
  return recommendations;
}

// Run backup and link pyramid creation
async function main() {
  try {
    const backup = await backupBlogData();
    const linkPyramid = await createLinkPyramidStructure();
    
    console.log('\n🎉 All backup tasks completed successfully!');
    console.log('📦 Blog data backed up and ready for deployment');
    console.log('🔗 SEO link pyramid structure created');
    
    return { backup, linkPyramid };
    
  } catch (error) {
    console.error('❌ Main process failed:', error);
    process.exit(1);
  }
}

export { backupBlogData, createLinkPyramidStructure };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}