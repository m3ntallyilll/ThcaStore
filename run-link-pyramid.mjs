#!/usr/bin/env node

import { config } from 'dotenv';
config();

// Dynamic imports to handle ES modules
const { aiLinkPyramidService } = await import('./server/ai-link-pyramid-service.js');

console.log('🔗 Starting AI Link Pyramid Generation...');
console.log('=====================================');

async function runLinkPyramid() {
  try {
    console.log('📊 Step 1: Building intelligent link pyramid strategy...');
    const strategy = await aiLinkPyramidService.buildIntelligentLinkPyramid();
    
    console.log('✅ Link pyramid strategy generated successfully!');
    console.log(`📈 Found ${strategy.topTierPosts.length} top-tier posts`);
    console.log(`📈 Found ${strategy.middleTierPosts.length} middle-tier posts`);
    console.log(`📈 Found ${strategy.baseTierPosts.length} base-tier posts`);
    console.log(`🔗 Generated ${strategy.linkingStrategy.length} linking recommendations`);
    
    console.log('\n🚀 Step 2: Implementing strategic internal links...');
    await aiLinkPyramidService.implementLinkPyramid(strategy);
    
    console.log('\n🎯 SUCCESS: AI Link Pyramid Implementation Complete!');
    console.log('=====================================');
    console.log('🌟 Your blog now has strategic internal linking');
    console.log('📈 SEO authority flow has been optimized');
    console.log('🔍 Search engines will better understand your content structure');
    console.log('🎉 Your website should see improved search rankings!');
    
  } catch (error) {
    console.error('❌ Error running link pyramid:', error.message);
    
    if (error.message.includes('Need at least 3 published posts')) {
      console.log('\n💡 TIP: You need at least 3 published blog posts to create a link pyramid.');
      console.log('   Create more blog content first, then run this script again.');
    } else if (error.message.includes('GROQ_API_KEY')) {
      console.log('\n💡 TIP: Make sure your GROQ_API_KEY environment variable is set.');
    } else {
      console.log('\n💡 Check your database connection and try again.');
    }
    
    process.exit(1);
  }
}

runLinkPyramid();