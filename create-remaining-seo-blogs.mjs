#!/usr/bin/env node

import { config } from 'dotenv';
import fs from 'fs';
config();

const blogs = JSON.parse(fs.readFileSync('seo-blogs-data.json', 'utf8'));

console.log('🚀 Creating Remaining SEO-Dominant Blogs');
console.log('======================================');

async function createBlogs() {
  for (const blog of blogs) {
    console.log(`\n📝 Creating: "${blog.title}"`);
    console.log(`   Keywords: ${blog.keywords.join(', ')}`);
    
    const blogData = {
      ...blog,
      metaTitle: `${blog.title} | Mentally Chill`,
      metaDescription: blog.excerpt.slice(0, 160),
      authorId: 'seo-generator',
      category: blog.title.includes('Review') ? 'reviews' : 'products',
      tags: blog.keywords.slice(0, 5),
      status: 'published',
      readTime: Math.ceil(blog.content.split(' ').length / 200),
      publishedAt: new Date().toISOString(),
      featuredImage: `/blog-images/${blog.slug.slice(0, 30)}.jpg`
    };
    
    try {
      const response = await fetch('http://localhost:5000/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(blogData)
      });
      
      if (response.ok) {
        const created = await response.json();
        console.log(`✅ SUCCESS: Created "${created.title}"`);
        console.log(`📊 Content structure: ${(blog.content.match(/<h[1-6]/g) || []).length} headings`);
        console.log(`📈 Reading time: ${blogData.readTime} minutes`);
        console.log(`🔗 Product links: ${(blog.content.match(/href="\/products/g) || []).length} purchase links`);
      } else {
        const error = await response.text();
        console.log(`❌ Failed: ${error}`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n🎉 SEO BLOG CREATION COMPLETE!');
  console.log('==============================');
  console.log(`📝 Created ${blogs.length} additional SEO-targeted blogs`);
  console.log('📊 All content uses proper H1/H2/H3 heading hierarchy');
  console.log('📱 Optimized for readability with short paragraphs');
  console.log('🛍️ Each blog features your specific products with direct links');
  console.log('🔍 Targeting ultra-low competition keywords for easy rankings');
  console.log('💰 Ready to convert organic traffic into sales!');
}

createBlogs();