import { aiSEOService } from './ai-seo-service.js';
import { aiLinkPyramidService } from './ai-link-pyramid-service.js';
import { storage } from './storage.js';

async function testAISEO() {
  console.log('🚀 Testing AI SEO Enhancement System...\n');

  try {
    // Get some blog posts to work with
    const posts = await storage.getPublishedBlogPosts();
    console.log(`📊 Found ${posts.length} published blog posts`);

    if (posts.length === 0) {
      console.log('❌ No published blog posts found. Create some blog posts first.');
      return;
    }

    // Test 1: Generate enhanced metadata for first post
    console.log('\n🎯 Test 1: Generating AI-enhanced metadata...');
    const firstPost = posts[0];
    console.log(`Working with post: "${firstPost.title}"`);

    const metadata = await aiSEOService.generateEnhancedMetadata(
      firstPost, 
      ['THCA', 'hemp flower', 'premium cannabis', 'lab tested']
    );

    console.log('✅ Generated metadata:');
    console.log(`- Meta Title: ${metadata.metaTitle}`);
    console.log(`- Meta Description: ${metadata.metaDescription}`);
    console.log(`- Keywords: ${metadata.keywords.join(', ')}`);
    console.log(`- Alt Text: ${metadata.altText}`);

    // Test 2: Generate internal link suggestions
    console.log('\n🔗 Test 2: Generating internal link pyramid...');
    const linkSuggestions = await aiSEOService.generateInternalLinkPyramid(firstPost);
    console.log(`✅ Generated ${linkSuggestions.length} internal link suggestions:`);
    linkSuggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. "${suggestion.anchorText}" → ${suggestion.title} (Score: ${suggestion.relevanceScore})`);
    });

    // Test 3: Full SEO enhancement
    if (posts.length >= 3) {
      console.log('\n💫 Test 3: Full SEO enhancement...');
      await aiSEOService.enhanceBlogPostSEO(firstPost.id, ['THCA premium', 'hemp education']);
      console.log('✅ Full SEO enhancement completed');
    }

    // Test 4: Link pyramid analysis
    console.log('\n🏗️ Test 4: Building intelligent link pyramid...');
    const pyramidStrategy = await aiLinkPyramidService.buildIntelligentLinkPyramid();
    
    console.log('✅ Link pyramid strategy generated:');
    console.log(`- Top Tier Posts: ${pyramidStrategy.topTierPosts.length}`);
    console.log(`- Middle Tier Posts: ${pyramidStrategy.middleTierPosts.length}`);
    console.log(`- Base Tier Posts: ${pyramidStrategy.baseTierPosts.length}`);
    console.log(`- Total Internal Links: ${pyramidStrategy.linkingStrategy.length}`);

    // Show top tier posts
    if (pyramidStrategy.topTierPosts.length > 0) {
      console.log('\n🏆 Top Tier (Pillar) Posts:');
      pyramidStrategy.topTierPosts.forEach(post => {
        console.log(`- "${post.title}" (Authority Score: ${post.authorityScore})`);
      });
    }

    // Test 5: Pyramid health analysis
    console.log('\n🩺 Test 5: Analyzing pyramid health...');
    const healthReport = await aiLinkPyramidService.analyzePyramidHealth();
    
    console.log('✅ Pyramid health analysis:');
    console.log(`- Overall Score: ${healthReport.overallScore}/100`);
    console.log(`- Issues Found: ${healthReport.issues.length}`);
    console.log(`- Recommendations: ${healthReport.recommendations.length}`);
    
    if (healthReport.issues.length > 0) {
      console.log('\n⚠️ Issues:');
      healthReport.issues.forEach(issue => console.log(`- ${issue}`));
    }

    if (healthReport.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      healthReport.recommendations.forEach(rec => console.log(`- ${rec}`));
    }

    console.log('\n🎉 AI SEO Enhancement System Test Complete!');
    console.log('\n📈 Ready to dominate search rankings with AI-powered optimization!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAISEO().catch(console.error);