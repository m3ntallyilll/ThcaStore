#!/usr/bin/env node

import fetch from 'node-fetch';

const BLOG_TOPICS = [
  // Education Category (25 topics)
  { topic: "THCA vs THC: Complete Scientific Comparison", category: "education", keywords: ["THCA", "THC", "hemp", "science", "comparison"] },
  { topic: "Understanding Hemp-Derived THCA: Legal & Scientific Guide", category: "education", keywords: ["hemp", "THCA", "legal", "scientific", "guide"] },
  { topic: "THCA Benefits: Evidence-Based Health Research", category: "education", keywords: ["THCA", "benefits", "health", "research", "evidence"] },
  { topic: "Hemp Flower vs THCA Concentrates: Which is Better?", category: "education", keywords: ["hemp", "flower", "THCA", "concentrates", "comparison"] },
  { topic: "THCA Dosage Guide: Safe Usage for Beginners", category: "education", keywords: ["THCA", "dosage", "beginners", "safety", "guide"] },
  { topic: "Lab Testing THCA Products: What to Look For", category: "education", keywords: ["lab", "testing", "THCA", "quality", "safety"] },
  { topic: "THCA Decarboxylation: Science Behind Activation", category: "education", keywords: ["THCA", "decarboxylation", "activation", "science", "chemistry"] },
  { topic: "Hemp Terpenes and THCA: Entourage Effect Explained", category: "education", keywords: ["hemp", "terpenes", "THCA", "entourage", "effect"] },
  { topic: "THCA for Wellness: Daily Integration Strategies", category: "education", keywords: ["THCA", "wellness", "daily", "integration", "health"] },
  { topic: "Understanding THCA Potency and Purity Standards", category: "education", keywords: ["THCA", "potency", "purity", "standards", "quality"] },
  { topic: "Hemp Cultivation: From Seed to THCA Product", category: "education", keywords: ["hemp", "cultivation", "THCA", "farming", "production"] },
  { topic: "THCA Storage: Preserving Quality and Potency", category: "education", keywords: ["THCA", "storage", "quality", "potency", "preservation"] },
  { topic: "THCA and the Endocannabinoid System: Scientific Overview", category: "education", keywords: ["THCA", "endocannabinoid", "system", "science", "biology"] },
  { topic: "Hemp Processing: Creating Premium THCA Products", category: "education", keywords: ["hemp", "processing", "THCA", "premium", "products"] },
  { topic: "THCA Bioavailability: Maximizing Absorption", category: "education", keywords: ["THCA", "bioavailability", "absorption", "efficiency", "science"] },
  { topic: "Hemp Genetics: THCA-Rich Strain Development", category: "education", keywords: ["hemp", "genetics", "THCA", "strains", "development"] },
  { topic: "THCA vs CBD: Comprehensive Wellness Comparison", category: "education", keywords: ["THCA", "CBD", "wellness", "comparison", "benefits"] },
  { topic: "Quality Control in THCA Manufacturing", category: "education", keywords: ["quality", "control", "THCA", "manufacturing", "standards"] },
  { topic: "THCA Research: Latest Scientific Discoveries", category: "education", keywords: ["THCA", "research", "scientific", "discoveries", "studies"] },
  { topic: "Hemp Extraction Methods for THCA Products", category: "education", keywords: ["hemp", "extraction", "methods", "THCA", "products"] },
  { topic: "THCA Stability: Factors Affecting Product Quality", category: "education", keywords: ["THCA", "stability", "quality", "factors", "preservation"] },
  { topic: "Understanding THCA Certificates of Analysis", category: "education", keywords: ["THCA", "COA", "analysis", "testing", "quality"] },
  { topic: "Hemp Industry Standards for THCA Products", category: "education", keywords: ["hemp", "industry", "standards", "THCA", "products"] },
  { topic: "THCA Consumption Methods: Complete Guide", category: "education", keywords: ["THCA", "consumption", "methods", "guide", "usage"] },
  { topic: "Hemp Legal Framework: THCA Compliance Guide", category: "education", keywords: ["hemp", "legal", "framework", "THCA", "compliance"] },

  // Products Category (25 topics)
  { topic: "Best THCA Flower Strains for 2025", category: "products", keywords: ["THCA", "flower", "strains", "2025", "best"] },
  { topic: "Premium Hemp THCA Products Review", category: "products", keywords: ["premium", "hemp", "THCA", "products", "review"] },
  { topic: "THCA Pre-Rolls: Ultimate Buying Guide", category: "products", keywords: ["THCA", "pre-rolls", "buying", "guide", "products"] },
  { topic: "Top 10 THCA Concentrates for Beginners", category: "products", keywords: ["THCA", "concentrates", "beginners", "top", "products"] },
  { topic: "Hemp Flower vs THCA Diamonds: Product Comparison", category: "products", keywords: ["hemp", "flower", "THCA", "diamonds", "comparison"] },
  { topic: "THCA Edibles: Products and Dosing Guide", category: "products", keywords: ["THCA", "edibles", "products", "dosing", "guide"] },
  { topic: "High-Potency THCA Products for Experienced Users", category: "products", keywords: ["high-potency", "THCA", "products", "experienced", "users"] },
  { topic: "Budget-Friendly THCA Products That Deliver Quality", category: "products", keywords: ["budget", "THCA", "products", "quality", "affordable"] },
  { topic: "THCA Vape Products: Complete Product Guide", category: "products", keywords: ["THCA", "vape", "products", "guide", "vaping"] },
  { topic: "Organic THCA Products: Pure Hemp Solutions", category: "products", keywords: ["organic", "THCA", "products", "pure", "hemp"] },
  { topic: "THCA Product Bundles: Maximum Value Packages", category: "products", keywords: ["THCA", "bundles", "packages", "value", "products"] },
  { topic: "Small Batch THCA: Artisan Hemp Products", category: "products", keywords: ["small", "batch", "THCA", "artisan", "hemp"] },
  { topic: "THCA Product Testing: Quality Assurance Guide", category: "products", keywords: ["THCA", "testing", "quality", "assurance", "products"] },
  { topic: "Seasonal THCA Products: Limited Edition Releases", category: "products", keywords: ["seasonal", "THCA", "products", "limited", "edition"] },
  { topic: "THCA Product Storage Solutions and Accessories", category: "products", keywords: ["THCA", "storage", "solutions", "accessories", "products"] },
  { topic: "New THCA Product Launches: Innovation Spotlight", category: "products", keywords: ["new", "THCA", "products", "innovation", "launches"] },
  { topic: "THCA Product Customization: Personalized Hemp", category: "products", keywords: ["THCA", "customization", "personalized", "hemp", "products"] },
  { topic: "THCA Product Variety Packs: Exploration Sets", category: "products", keywords: ["THCA", "variety", "packs", "exploration", "products"] },
  { topic: "Premium THCA Gift Sets: Perfect Hemp Presents", category: "products", keywords: ["premium", "THCA", "gifts", "hemp", "presents"] },
  { topic: "THCA Product Subscriptions: Regular Delivery Service", category: "products", keywords: ["THCA", "subscriptions", "delivery", "service", "products"] },
  { topic: "Fast-Acting THCA Products: Quick Relief Options", category: "products", keywords: ["fast-acting", "THCA", "products", "quick", "relief"] },
  { topic: "Long-Lasting THCA Products: Extended Duration", category: "products", keywords: ["long-lasting", "THCA", "products", "extended", "duration"] },
  { topic: "THCA Product Combinations: Synergistic Effects", category: "products", keywords: ["THCA", "combinations", "synergistic", "effects", "products"] },
  { topic: "Travel-Friendly THCA Products: Portable Solutions", category: "products", keywords: ["travel", "THCA", "products", "portable", "solutions"] },
  { topic: "THCA Product Innovation: Future Hemp Technologies", category: "products", keywords: ["THCA", "innovation", "future", "hemp", "technology"] },

  // Health Category (25 topics)
  { topic: "THCA for Pain Management: Clinical Evidence", category: "health", keywords: ["THCA", "pain", "management", "clinical", "evidence"] },
  { topic: "THCA and Sleep Quality: Research Insights", category: "health", keywords: ["THCA", "sleep", "quality", "research", "insomnia"] },
  { topic: "THCA for Anxiety Relief: Natural Wellness", category: "health", keywords: ["THCA", "anxiety", "relief", "natural", "wellness"] },
  { topic: "THCA Anti-Inflammatory Properties: Health Benefits", category: "health", keywords: ["THCA", "anti-inflammatory", "properties", "health", "benefits"] },
  { topic: "THCA and Mental Health: Therapeutic Potential", category: "health", keywords: ["THCA", "mental", "health", "therapeutic", "potential"] },
  { topic: "THCA for Digestive Health: Gut Wellness", category: "health", keywords: ["THCA", "digestive", "health", "gut", "wellness"] },
  { topic: "THCA and Stress Management: Natural Solutions", category: "health", keywords: ["THCA", "stress", "management", "natural", "solutions"] },
  { topic: "THCA for Exercise Recovery: Athletic Performance", category: "health", keywords: ["THCA", "exercise", "recovery", "athletic", "performance"] },
  { topic: "THCA and Aging: Healthy Longevity Support", category: "health", keywords: ["THCA", "aging", "longevity", "healthy", "support"] },
  { topic: "THCA for Immune System: Wellness Support", category: "health", keywords: ["THCA", "immune", "system", "wellness", "support"] },
  { topic: "THCA and Cognitive Function: Brain Health", category: "health", keywords: ["THCA", "cognitive", "function", "brain", "health"] },
  { topic: "THCA for Chronic Conditions: Long-term Wellness", category: "health", keywords: ["THCA", "chronic", "conditions", "long-term", "wellness"] },
  { topic: "THCA Safety Profile: Side Effects and Precautions", category: "health", keywords: ["THCA", "safety", "side", "effects", "precautions"] },
  { topic: "THCA Drug Interactions: Important Considerations", category: "health", keywords: ["THCA", "drug", "interactions", "considerations", "safety"] },
  { topic: "THCA for Women's Health: Specialized Wellness", category: "health", keywords: ["THCA", "women", "health", "specialized", "wellness"] },
  { topic: "THCA for Senior Health: Age-Appropriate Wellness", category: "health", keywords: ["THCA", "senior", "health", "age-appropriate", "wellness"] },
  { topic: "THCA and Metabolism: Weight Management Support", category: "health", keywords: ["THCA", "metabolism", "weight", "management", "support"] },
  { topic: "THCA for Skin Health: Topical Applications", category: "health", keywords: ["THCA", "skin", "health", "topical", "applications"] },
  { topic: "THCA and Cardiovascular Health: Heart Wellness", category: "health", keywords: ["THCA", "cardiovascular", "health", "heart", "wellness"] },
  { topic: "THCA for Neurological Support: Brain Protection", category: "health", keywords: ["THCA", "neurological", "support", "brain", "protection"] },
  { topic: "THCA Therapeutic Dosing: Personalized Wellness", category: "health", keywords: ["THCA", "therapeutic", "dosing", "personalized", "wellness"] },
  { topic: "THCA and Holistic Health: Integrative Wellness", category: "health", keywords: ["THCA", "holistic", "health", "integrative", "wellness"] },
  { topic: "THCA Clinical Studies: Research-Based Evidence", category: "health", keywords: ["THCA", "clinical", "studies", "research", "evidence"] },
  { topic: "THCA Wellness Protocols: Structured Health Plans", category: "health", keywords: ["THCA", "wellness", "protocols", "structured", "health"] },
  { topic: "THCA Health Monitoring: Tracking Wellness Progress", category: "health", keywords: ["THCA", "health", "monitoring", "tracking", "progress"] },

  // Legal Category (25 topics)
  { topic: "THCA Legal Status 2025: State-by-State Guide", category: "legal", keywords: ["THCA", "legal", "status", "2025", "states"] },
  { topic: "Hemp Farm Bill and THCA: Federal Regulations", category: "legal", keywords: ["hemp", "farm", "bill", "THCA", "federal"] },
  { topic: "THCA Interstate Commerce: Shipping and Transport", category: "legal", keywords: ["THCA", "interstate", "commerce", "shipping", "transport"] },
  { topic: "THCA Testing Requirements: Legal Compliance", category: "legal", keywords: ["THCA", "testing", "requirements", "legal", "compliance"] },
  { topic: "THCA Business Licensing: Legal Requirements", category: "legal", keywords: ["THCA", "business", "licensing", "legal", "requirements"] },
  { topic: "THCA Age Restrictions: Legal Purchase Guidelines", category: "legal", keywords: ["THCA", "age", "restrictions", "legal", "purchase"] },
  { topic: "THCA Workplace Policies: Employment Law", category: "legal", keywords: ["THCA", "workplace", "policies", "employment", "law"] },
  { topic: "THCA and Driving: Legal Safety Considerations", category: "legal", keywords: ["THCA", "driving", "legal", "safety", "considerations"] },
  { topic: "THCA International Laws: Global Legal Landscape", category: "legal", keywords: ["THCA", "international", "laws", "global", "legal"] },
  { topic: "THCA Patent Law: Intellectual Property Rights", category: "legal", keywords: ["THCA", "patent", "law", "intellectual", "property"] },
  { topic: "THCA Banking Regulations: Financial Compliance", category: "legal", keywords: ["THCA", "banking", "regulations", "financial", "compliance"] },
  { topic: "THCA Advertising Laws: Marketing Compliance", category: "legal", keywords: ["THCA", "advertising", "laws", "marketing", "compliance"] },
  { topic: "THCA Quality Standards: Legal Requirements", category: "legal", keywords: ["THCA", "quality", "standards", "legal", "requirements"] },
  { topic: "THCA Labeling Laws: Consumer Protection", category: "legal", keywords: ["THCA", "labeling", "laws", "consumer", "protection"] },
  { topic: "THCA Tax Implications: Legal Financial Obligations", category: "legal", keywords: ["THCA", "tax", "implications", "legal", "financial"] },
  { topic: "THCA Criminal Law: Legal Protections and Risks", category: "legal", keywords: ["THCA", "criminal", "law", "legal", "protections"] },
  { topic: "THCA Civil Rights: Legal Consumer Protections", category: "legal", keywords: ["THCA", "civil", "rights", "legal", "consumer"] },
  { topic: "THCA Insurance Law: Coverage and Liability", category: "legal", keywords: ["THCA", "insurance", "law", "coverage", "liability"] },
  { topic: "THCA Contract Law: Business Legal Framework", category: "legal", keywords: ["THCA", "contract", "law", "business", "legal"] },
  { topic: "THCA Regulatory Changes: Legal Updates 2025", category: "legal", keywords: ["THCA", "regulatory", "changes", "legal", "updates"] },
  { topic: "THCA Legal Precedents: Case Law Analysis", category: "legal", keywords: ["THCA", "legal", "precedents", "case", "law"] },
  { topic: "THCA Municipal Laws: Local Legal Regulations", category: "legal", keywords: ["THCA", "municipal", "laws", "local", "regulations"] },
  { topic: "THCA Legal Consulting: Professional Guidance", category: "legal", keywords: ["THCA", "legal", "consulting", "professional", "guidance"] },
  { topic: "THCA Compliance Audits: Legal Business Practices", category: "legal", keywords: ["THCA", "compliance", "audits", "legal", "business"] },
  { topic: "THCA Legal Defense: Rights and Protections", category: "legal", keywords: ["THCA", "legal", "defense", "rights", "protections"] }
];

async function generateBlog(blogData) {
  try {
    const response = await fetch('http://localhost:5000/api/blog/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: blogData.topic,
        category: blogData.category,
        keywords: blogData.keywords,
        tone: "educational",
        length: "medium",
        targetAudience: "hemp enthusiasts and beginners",
        includeCallToAction: true
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Generated: ${result.title}`);
      return { success: true, title: result.title, id: result.id };
    } else {
      const error = await response.text();
      console.log(`❌ Failed: ${blogData.topic} - ${error}`);
      return { success: false, topic: blogData.topic, error };
    }
  } catch (error) {
    console.log(`❌ Error: ${blogData.topic} - ${error.message}`);
    return { success: false, topic: blogData.topic, error: error.message };
  }
}

async function generateAllBlogs() {
  console.log(`🚀 Starting generation of ${BLOG_TOPICS.length} SEO-optimized blogs...`);
  
  const results = [];
  const batchSize = 3; // Process in small batches to avoid rate limits
  
  for (let i = 0; i < BLOG_TOPICS.length; i += batchSize) {
    const batch = BLOG_TOPICS.slice(i, i + batchSize);
    console.log(`\n📝 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(BLOG_TOPICS.length/batchSize)}:`);
    
    const batchPromises = batch.map(blog => generateBlog(blog));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches
    if (i + batchSize < BLOG_TOPICS.length) {
      console.log('⏳ Waiting 2 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n🎉 Blog generation complete!`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${results.length}`);
  
  return results;
}

// Run the generation
generateAllBlogs().catch(console.error);