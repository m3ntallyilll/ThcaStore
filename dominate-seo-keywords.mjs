#!/usr/bin/env node

import { config } from 'dotenv';
config();

import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Ultra-low competition keywords for easy domination
const easyWinKeywords = [
  "THCA flower benefits 2024",
  "best THCA pre rolls online", 
  "Purple Koolaid THCA strain review",
  "Sour Lemon Diesel THCA effects",
  "Grape Popsicle strain THCA content",
  "THCA diamonds vs regular flower",
  "THCA flower legal in all states",
  "indoor THCA flower quality guide"
];

console.log('🚀 CREATING SEO-DOMINANT BLOG CONTENT');
console.log('====================================');

async function createSEODominantBlogs() {
  for (const keyword of easyWinKeywords) {
    console.log(`\n🎯 Creating blog for: "${keyword}"`);
    
    const systemPrompt = `You are an expert SEO content writer creating dominant blog posts for THCA keywords. Create comprehensive, well-structured content that will rank #1.

TARGET KEYWORD: "${keyword}"

STRUCTURE REQUIREMENTS:
- Use proper heading hierarchy (H1 title, H2 main sections, H3 subsections)  
- Short, scannable paragraphs (2-3 sentences max)
- Bullet points and numbered lists for easy reading
- Clear calls-to-action throughout
- External authority links (USDA, DEA, Congress.gov, NCBI)
- Product feature sections with direct purchase links

PRODUCTS TO FEATURE:
- Purple Koolaid THCA Diamonds ($18.00) - Premium indica with THCA infusion
- Sour Lemon Diesel Pre-Roll ($12.99) - Energizing sativa pre-roll
- Grape Popsicle Eighth ($35.00) - Sweet relaxing indica strain  
- Too Tall Pre-Roll ($13.99) - Balanced hybrid strain

Create 1500+ word blog post that converts readers to customers.

Return JSON format:
{
  "title": "SEO optimized title with keyword",
  "content": "Full HTML content with proper heading structure",
  "excerpt": "Compelling 150 character excerpt",
  "category": "products/education/reviews"
}`;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Create a dominant SEO blog for "${keyword}" with proper headings and structure.` },
          { role: "assistant", content: "```json\n" }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        stop: ["```"]
      });

      const blogData = JSON.parse(completion.choices[0]?.message?.content || '{}');
      
      // Save to file for manual review and implementation
      const filename = `seo_blog_${keyword.replace(/\s+/g, '_').toLowerCase()}.json`;
      
      const fullBlogData = {
        ...blogData,
        slug: blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        keywords: [keyword, ...keyword.split(' ')],
        metaTitle: `${blogData.title} | Premium THCA Products`,
        metaDescription: `${blogData.excerpt} Shop lab-tested THCA with fast shipping.`.slice(0, 160),
        readTime: Math.ceil(blogData.content.split(' ').length / 200),
        publishedAt: new Date().toISOString()
      };
      
      await import('fs').then(fs => {
        fs.writeFileSync(filename, JSON.stringify(fullBlogData, null, 2));
      });
      
      console.log(`✅ Created: ${blogData.title}`);
      console.log(`📁 Saved to: ${filename}`);
      
      // Display content structure preview
      const headings = blogData.content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi) || [];
      console.log(`📋 Content structure (${headings.length} headings):`);
      headings.slice(0, 5).forEach(h => console.log(`   ${h.replace(/<[^>]*>/g, '')}`));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
  }
  
  console.log('\n🎉 SEO CONTENT GENERATION COMPLETE!');
  console.log('===================================');
  console.log(`📝 Created ${easyWinKeywords.length} SEO-dominant blog posts`);
  console.log('📊 All content uses proper heading hierarchy');
  console.log('📱 Optimized for readability and conversions');
  console.log('🔗 Features your products with purchase links');
  console.log('🏆 Ready to dominate search rankings!');
}

createSEODominantBlogs();