import Groq from 'groq-sdk';
import { writeFileSync } from 'fs';

async function generateDailyDeals() {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const prompt = `You are an expert THCA hemp retail strategist. Generate 7 dynamic daily deals for a premium THCA store with real inventory of 6,552 lbs flower and 1,360 pre-rolls.

Context:
- Target daily revenue: $8000
- Customer segment: Premium hemp enthusiasts seeking quality THCA products
- Inventory: Blue Dream, Green Crack, Sour Diesel, OG Kush, Purple Punch, Granddaddy Purple, Girl Scout Cookies, Gelato
- Pre-rolls: Infused and regular varieties, Northern Lights, Jack Herer, Zkittlez

Generate exactly 7 daily deals (Sunday=0 through Saturday=6) with realistic discounts that move inventory:

1. Deal name (catchy, hemp-focused)
2. Discount type (percentage, fixed, bogo) 
3. Discount value (15-30% range)
4. Target category or specific strains
5. Marketing message (hemp-compliant, engaging)

Return ONLY a JSON array with objects containing: dayOfWeek (0-6), title, description, discountType, discountValue, categories, isActive, marketingMessage.`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a hemp retail expert. Return only valid JSON arrays."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 2000
    });

    const dealsJSON = response.choices[0]?.message?.content;
    console.log("🚀 AI-Generated Daily Deals for THCA Store:");
    console.log(dealsJSON);
    
    // Save for deployment
    writeFileSync('daily_deals_generated.json', dealsJSON, 'utf8');
    console.log("\n✅ Daily deals saved to daily_deals_generated.json");
    
    return dealsJSON;
  } catch (error) {
    console.error('❌ Error generating deals:', error.message);
    
    // Fallback deals based on actual inventory
    const fallbackDeals = [
      {
        dayOfWeek: 0,
        title: "Sunday Sativa Selections",
        description: "25% off Blue Dream, Green Crack, and Sour Diesel flower",
        discountType: "percentage",
        discountValue: 25,
        categories: ["flower"],
        isActive: true,
        marketingMessage: "Energize your Sunday with premium sativa THCA flower!"
      },
      {
        dayOfWeek: 1,
        title: "Mellow Monday Mix",
        description: "Buy 2 pre-roll packs, get 1 half off",
        discountType: "bogo",
        discountValue: 50,
        categories: ["pre-rolls"],
        isActive: true,
        marketingMessage: "Start your week right with premium pre-rolls!"
      },
      {
        dayOfWeek: 2,
        title: "Therapeutic Tuesday",
        description: "20% off OG Kush, Purple Punch, Granddaddy Purple",
        discountType: "percentage", 
        discountValue: 20,
        categories: ["flower"],
        isActive: true,
        marketingMessage: "Relax and unwind with premium indica THCA!"
      },
      {
        dayOfWeek: 3,
        title: "Wednesday Wellness",
        description: "Hybrid strains 18% off - Girl Scout Cookies & Gelato",
        discountType: "percentage",
        discountValue: 18,
        categories: ["flower"],
        isActive: true,
        marketingMessage: "Balanced effects for mid-week wellness!"
      },
      {
        dayOfWeek: 4,
        title: "Thirsty Thursday",
        description: "Infused pre-rolls buy 3 get 1 free",
        discountType: "bundle",
        discountValue: 25,
        categories: ["pre-rolls"],
        isActive: true,
        marketingMessage: "Premium infused pre-rolls with live resin!"
      },
      {
        dayOfWeek: 5,
        title: "Flower Friday",
        description: "Any flower strain 1/4 oz or more gets 22% off",
        discountType: "percentage",
        discountValue: 22,
        categories: ["flower"],
        isActive: true,
        marketingMessage: "Stock up for the weekend with premium THCA flower!"
      },
      {
        dayOfWeek: 6,
        title: "Saturday Sampler",
        description: "Mix and match any 5 pre-rolls for $40",
        discountType: "fixed",
        discountValue: 40,
        categories: ["pre-rolls"],
        isActive: true,
        marketingMessage: "Try multiple strains with our Saturday sampler!"
      }
    ];
    
    const fallbackJSON = JSON.stringify(fallbackDeals, null, 2);
    writeFileSync('daily_deals_generated.json', fallbackJSON, 'utf8');
    console.log("💡 Fallback deals created and saved!");
    return fallbackJSON;
  }
}

generateDailyDeals();
