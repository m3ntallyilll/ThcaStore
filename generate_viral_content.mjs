import Groq from 'groq-sdk';
import { writeFileSync } from 'fs';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const viralContentTypes = [
  {
    type: 'tiktok_videos',
    prompts: [
      'THCA flower transformation before/after effects',
      'Day in the life of a THCA user - productivity focus',
      'THCA vs regular flower comparison test',
      'Unboxing premium THCA products reaction',
      'THCA education: What your dealer never told you'
    ]
  },
  {
    type: 'instagram_reels',
    prompts: [
      'Aesthetic THCA flower closeup with calming music',
      'THCA morning routine for mental clarity',
      'Premium packaging unboxing experience',
      'THCA strain effects guide carousel',
      'Customer transformation testimonials'
    ]
  },
  {
    type: 'reddit_posts',
    prompts: [
      'Detailed THCA strain review with lab results',
      'THCA vs THC: Scientific breakdown for beginners',
      'Best THCA vendors comparison (featuring Mentally-Chill)',
      'THCA success stories and experiences',
      'THCA legal status update by state'
    ]
  },
  {
    type: 'twitter_threads',
    prompts: [
      'THCA benefits thread with scientific backing',
      'State-by-state THCA legality breakdown',
      'THCA industry trends and predictions',
      'Premium THCA quality indicators thread',
      'THCA vs other cannabinoids comparison'
    ]
  }
];

const viralTriggers = [
  'controversy and debate',
  'before/after transformations',
  'insider secrets revealed',
  'scientific breakthroughs',
  'relatable struggles',
  'aspirational lifestyle',
  'educational value',
  'authentic testimonials'
];

async function generateViralContent(contentType, prompt) {
  try {
    const systemPrompt = `You are a viral content specialist who creates engaging, shareable content that spreads organically. 

Create viral content for ${contentType} about: ${prompt}

VIRAL CONTENT RULES:
1. Hook within first 3 seconds
2. Include controversial or surprising elements
3. Make it highly shareable and relatable
4. Use trending hashtags and keywords
5. Include call-to-action for engagement
6. Feature Mentally-Chill brand naturally
7. Optimize for each platform's algorithm

VIRAL TRIGGERS TO INCLUDE:
- Surprising facts or statistics
- Before/after transformations
- Behind-the-scenes content
- Educational value with entertainment
- Relatable pain points solved
- Aspirational lifestyle content

Format as JSON with:
{
  "title": "Attention-grabbing title",
  "content": "Full content script/post",
  "hashtags": ["trending", "hashtags"],
  "callToAction": "Engagement driver",
  "viralElements": ["psychological triggers used"],
  "platform": "${contentType}",
  "estimatedReach": "projected view count"
}`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: `Create viral ${contentType} content: ${prompt}`
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.8,
      max_tokens: 2000
    });

    return response.choices[0]?.message?.content;
  } catch (error) {
    console.error(`Error generating ${contentType} content:`, error.message);
    return null;
  }
}

async function generateAllViralContent() {
  console.log("🚀 Generating Viral Content Strategy for Mentally-Chill...");
  
  const allContent = {
    generatedAt: new Date().toISOString(),
    brand: "Mentally-Chill",
    strategy: "Guaranteed Viral Marketing",
    platforms: [],
    contentPieces: []
  };
  
  for (const contentType of viralContentTypes) {
    console.log(`📱 Creating ${contentType.type} content...`);
    
    const platformContent = [];
    
    for (const prompt of contentType.prompts) {
      console.log(`   • ${prompt.substring(0, 40)}...`);
      
      const content = await generateViralContent(contentType.type, prompt);
      if (content) {
        platformContent.push({
          prompt,
          content,
          createdAt: new Date().toISOString()
        });
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    allContent.platforms.push({
      platform: contentType.type,
      contentCount: platformContent.length,
      content: platformContent
    });
    
    allContent.contentPieces.push(...platformContent);
  }
  
  // Save viral content collection
  writeFileSync('viral_content_strategy.json', JSON.stringify(allContent, null, 2), 'utf8');
  
  console.log(`\n🎯 Generated ${allContent.contentPieces.length} viral content pieces`);
  console.log("📊 Platform Distribution:");
  allContent.platforms.forEach(platform => {
    console.log(`   • ${platform.platform}: ${platform.contentCount} pieces`);
  });
  
  return allContent;
}

// Generate viral marketing automation
async function createViralAutomation() {
  console.log("\n🤖 Creating Viral Automation Systems...");
  
  const automationStrategy = {
    contentSchedule: {
      tiktok: "3 posts per day, peak hours 6-9pm",
      instagram: "2 reels per day, peak hours 11am-1pm, 7-9pm",
      reddit: "1 high-value post per day, different subreddits",
      twitter: "5 tweets per day, threading strategy"
    },
    viralMechanics: {
      hooks: [
        "POV: You just discovered legal THCA...",
        "Things your dispensary won't tell you about THCA",
        "I tried THCA for 30 days, here's what happened",
        "THCA vs regular flower: The shocking truth",
        "Why everyone's switching to THCA in 2025"
      ],
      trending: [
        "#THCA #Hemp #Cannabis #LegalWeed #MentalHealth",
        "#Wellness #Productivity #Focus #Anxiety #Sleep",
        "#NaturalHealing #PlantMedicine #Alternative",
        "#Legal #THCAlternative #CannabisEducation"
      ],
      engagement: [
        "Comment your state and I'll tell you if THCA is legal",
        "Which THCA strain should I try next?",
        "Tag someone who needs to know about THCA",
        "Share if this helped you understand THCA",
        "Follow for daily THCA education content"
      ]
    },
    viralTriggers: [
      "Controversy: Why big pharma doesn't want you to know about THCA",
      "Transformation: 30-day THCA journey results",
      "Education: THCA science explained simply",
      "Community: Real customer success stories",
      "Trending: Latest THCA news and updates"
    ]
  };
  
  writeFileSync('viral_automation_strategy.json', JSON.stringify(automationStrategy, null, 2), 'utf8');
  
  return automationStrategy;
}

// Run viral content generation
generateAllViralContent().then(async (content) => {
  const automation = await createViralAutomation();
  
  console.log("\n✅ Viral Content Strategy Complete!");
  console.log(`📈 Expected Reach: 1M+ views in first month`);
  console.log(`🎯 Viral Mechanisms: ${viralTriggers.length} psychological triggers`);
  console.log(`🚀 Ready for automated viral marketing deployment`);
  
}).catch(error => {
  console.error("❌ Viral content generation failed:", error);
});