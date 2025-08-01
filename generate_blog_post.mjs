import Groq from 'groq-sdk';
import { writeFileSync } from 'fs';

async function generateBlogPost() {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const prompt = `Write a comprehensive blog post about THCA visibility and marketing for hemp retailers.

Topic: "How to Increase THCA Product Visibility in Search Results"
Target audience: Hemp store owners and THCA retailers
Word count: 1200-1500 words
Tone: Professional, informative, actionable

Include sections on:
1. Understanding THCA market visibility challenges
2. SEO strategies for hemp products
3. Legal compliance in marketing
4. Building brand awareness
5. Social media and content marketing
6. Local SEO for hemp retailers

Format as JSON with: title, content (full HTML), excerpt, metaTitle, metaDescription, keywords`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a hemp industry marketing expert and SEO specialist."
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

    const blogContent = response.choices[0]?.message?.content;
    console.log("📝 AI-Generated Blog Post:");
    console.log(blogContent.substring(0, 500) + "...");
    
    writeFileSync('blog_post_generated.json', blogContent, 'utf8');
    console.log("\n✅ Blog post saved to blog_post_generated.json");
    
    return blogContent;
  } catch (error) {
    console.error('❌ Error generating blog post:', error.message);
    return null;
  }
}

generateBlogPost();
