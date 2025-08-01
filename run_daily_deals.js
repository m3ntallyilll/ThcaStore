const Groq = require('groq-sdk');

async function generateDailyDeals() {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const prompt = `You are an expert cannabis retail strategist. Generate 7 dynamic daily deals for a premium THCA hemp store.

Context:
- Target daily revenue: $8000
- Customer segment: Premium hemp enthusiasts
- Inventory focus: THCA flower and pre-rolls
- Store specializes in high-quality hemp-derived THCA products

Generate exactly 7 daily deals (Sunday through Saturday) with:
1. Deal name (catchy, hemp-themed)
2. Discount type (percentage, fixed, bogo)
3. Discount value (reasonable but attractive)
4. Target category or specific products
5. Marketing message (engaging, compliant)

Format as JSON array with objects containing: dayOfWeek (0-6), title, description, discountType, discountValue, categories, isActive, marketingMessage.

Return ONLY the JSON array, no other text.`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a cannabis retail strategist expert. Generate only valid JSON responses."
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
    console.log("Generated Daily Deals:", dealsJSON);
    
    // Save to file for deployment
    require('fs').writeFileSync('daily_deals_generated.json', dealsJSON, 'utf8');
    console.log("Daily deals saved to daily_deals_generated.json");
    
    return dealsJSON;
  } catch (error) {
    console.error('Error generating deals:', error);
    return null;
  }
}

generateDailyDeals();
