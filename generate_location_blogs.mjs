import Groq from 'groq-sdk';
import { writeFileSync } from 'fs';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const targetStates = [
  'Alaska', 'California', 'Colorado', 'Oregon', 'Washington', 'Nevada', 
  'Arizona', 'Montana', 'Vermont', 'Maine', 'Massachusetts', 'Michigan',
  'Illinois', 'New York', 'Connecticut', 'New Jersey', 'Virginia', 'Delaware'
];

const targetKeywords = [
  'where to buy THCA in [STATE]',
  'THCA flower [STATE]',
  'legal THCA [STATE]', 
  'THCA dispensary [STATE]',
  'buy THCA online [STATE]',
  'THCA pre-rolls [STATE]',
  'premium THCA [STATE]',
  'THCA near me [STATE]'
];

async function generateLocationBlog(state) {
  try {
    const prompt = `Write a comprehensive SEO blog post about THCA availability in ${state}.

Title: "Where to Buy Premium THCA in ${state}: Complete 2025 Guide"

Target Keywords: "THCA ${state}", "buy THCA in ${state}", "THCA flower ${state}", "legal THCA ${state}"

Content Structure:
1. Introduction - THCA legality and availability in ${state}
2. Legal Status - ${state} hemp laws and regulations  
3. Where to Buy - Online vs local options
4. Product Types - Flower, pre-rolls, concentrates available
5. Quality Considerations - Lab testing, sourcing, purity
6. Pricing Guide - Average costs in ${state}
7. Shipping Information - Delivery to ${state}
8. Local Dispensaries - Hemp stores in major ${state} cities
9. FAQ Section - Common questions about THCA in ${state}
10. Conclusion - Best options for ${state} residents

Tone: Informative, helpful, compliant with hemp regulations
Word Count: 1500-2000 words
Include: Local city names, ${state} hemp laws, shipping details

Format as JSON with: title, content (HTML), excerpt, metaTitle, metaDescription, keywords, targetState`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a hemp industry expert specializing in state-specific THCA regulations and market analysis."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.6,
      max_tokens: 4000
    });

    return response.choices[0]?.message?.content;
  } catch (error) {
    console.error(`Error generating blog for ${state}:`, error.message);
    return null;
  }
}

async function generateAllLocationBlogs() {
  console.log("🎯 Generating Location-Specific THCA Blog Content...");
  
  const allBlogs = [];
  
  for (const state of targetStates.slice(0, 5)) { // Generate 5 priority states first
    console.log(`📝 Creating blog for ${state}...`);
    
    const blogContent = await generateLocationBlog(state);
    if (blogContent) {
      allBlogs.push({
        state,
        content: blogContent,
        generatedAt: new Date().toISOString()
      });
      
      // Save individual state blog
      writeFileSync(`blog_${state.toLowerCase().replace(' ', '_')}_generated.json`, blogContent, 'utf8');
      console.log(`✅ ${state} blog saved`);
    }
    
    // Rate limiting - wait between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Save combined blog collection
  const masterCollection = {
    generatedAt: new Date().toISOString(),
    totalBlogs: allBlogs.length,
    targetStates,
    targetKeywords,
    blogs: allBlogs
  };
  
  writeFileSync('location_blogs_collection.json', JSON.stringify(masterCollection, null, 2), 'utf8');
  console.log(`\n🚀 Generated ${allBlogs.length} location-specific THCA blogs`);
  console.log("📊 Target Keywords Covered:");
  targetKeywords.forEach(keyword => {
    console.log(`   • ${keyword}`);
  });
  
  return masterCollection;
}

// Run the location blog generator
generateAllLocationBlogs().then(result => {
  console.log("\n✅ Location-based blog generation complete!");
  console.log(`📈 SEO Impact: Targeting ${result.totalBlogs} state markets`);
  console.log("🎯 Ready for deployment to dominate local THCA searches");
}).catch(error => {
  console.error("❌ Blog generation failed:", error);
});