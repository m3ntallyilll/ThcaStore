import Groq from 'groq-sdk';

class GroqService {
  private client: Groq;

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY || 'gsk_dummy_key_for_development'
    });
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const chatCompletion = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 4000,
      });

      return chatCompletion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq API Error:', error);
      return '';
    }
  }
}

export interface CityData {
  city: string;
  state: string;
  county: string;
  population: number;
  isLegal: boolean;
  zipCodes: string[];
  nearbyTowns: string[];
}

export interface THCAKeywordSet {
  city: string;
  state: string;
  primaryKeywords: string[];
  longTailKeywords: string[];
  localVariations: string[];
  commercialKeywords: string[];
  urgentKeywords: string[];
  seoTitle: string;
  metaDescription: string;
  h1Tag: string;
  contentOutline: string[];
}

export class CityTHCAGenerator {
  private groq: GroqService;

  constructor() {
    this.groq = new GroqService();
  }

  // Major US cities where THCA is legal by state
  private readonly legalCitiesByState = {
    'California': [
      { city: 'Los Angeles', population: 3898747, county: 'Los Angeles County', zipCodes: ['90001', '90210', '90401', '90028'] },
      { city: 'San Francisco', population: 873965, county: 'San Francisco County', zipCodes: ['94102', '94103', '94107', '94109'] },
      { city: 'San Diego', population: 1386932, county: 'San Diego County', zipCodes: ['92101', '92102', '92103', '92109'] },
      { city: 'San Jose', population: 1013240, county: 'Santa Clara County', zipCodes: ['95110', '95112', '95113', '95116'] },
      { city: 'Oakland', population: 430666, county: 'Alameda County', zipCodes: ['94601', '94602', '94603', '94607'] },
      { city: 'Sacramento', population: 524943, county: 'Sacramento County', zipCodes: ['95814', '95815', '95816', '95817'] },
      { city: 'Long Beach', population: 466742, county: 'Los Angeles County', zipCodes: ['90802', '90803', '90804', '90805'] },
      { city: 'Fresno', population: 542107, county: 'Fresno County', zipCodes: ['93701', '93702', '93703', '93704'] },
      { city: 'Riverside', population: 331360, county: 'Riverside County', zipCodes: ['92501', '92502', '92503', '92504'] },
      { city: 'Bakersfield', population: 380874, county: 'Kern County', zipCodes: ['93301', '93302', '93303', '93304'] }
    ],
    'Colorado': [
      { city: 'Denver', population: 715522, county: 'Denver County', zipCodes: ['80202', '80203', '80204', '80205'] },
      { city: 'Colorado Springs', population: 478961, county: 'El Paso County', zipCodes: ['80901', '80902', '80903', '80904'] },
      { city: 'Aurora', population: 386261, county: 'Arapahoe County', zipCodes: ['80010', '80011', '80012', '80013'] },
      { city: 'Fort Collins', population: 169810, county: 'Larimer County', zipCodes: ['80521', '80523', '80524', '80525'] },
      { city: 'Lakewood', population: 155984, county: 'Jefferson County', zipCodes: ['80214', '80215', '80226', '80227'] },
      { city: 'Boulder', population: 108250, county: 'Boulder County', zipCodes: ['80301', '80302', '80303', '80304'] },
      { city: 'Pueblo', population: 111876, county: 'Pueblo County', zipCodes: ['81001', '81003', '81004', '81005'] },
      { city: 'Westminster', population: 113166, county: 'Adams County', zipCodes: ['80030', '80031', '80234', '80260'] },
      { city: 'Arvada', population: 121510, county: 'Jefferson County', zipCodes: ['80001', '80002', '80003', '80004'] },
      { city: 'Thornton', population: 141867, county: 'Adams County', zipCodes: ['80229', '80233', '80241', '80260'] }
    ],
    'Oregon': [
      { city: 'Portland', population: 650380, county: 'Multnomah County', zipCodes: ['97201', '97202', '97203', '97204'] },
      { city: 'Eugene', population: 176654, county: 'Lane County', zipCodes: ['97401', '97402', '97403', '97404'] },
      { city: 'Salem', population: 175535, county: 'Marion County', zipCodes: ['97301', '97302', '97303', '97304'] },
      { city: 'Gresham', population: 114247, county: 'Multnomah County', zipCodes: ['97030', '97080', '97236', '97266'] },
      { city: 'Hillsboro', population: 106447, county: 'Washington County', zipCodes: ['97123', '97124', '97006', '97007'] },
      { city: 'Bend', population: 99178, county: 'Deschutes County', zipCodes: ['97701', '97702', '97703', '97708'] },
      { city: 'Beaverton', population: 97494, county: 'Washington County', zipCodes: ['97005', '97006', '97007', '97008'] },
      { city: 'Medford', population: 85824, county: 'Jackson County', zipCodes: ['97501', '97502', '97504', '97540'] },
      { city: 'Springfield', population: 63480, county: 'Lane County', zipCodes: ['97477', '97478', '97401', '97403'] },
      { city: 'Corvallis', population: 58856, county: 'Benton County', zipCodes: ['97330', '97331', '97333', '97339'] }
    ],
    'Washington': [
      { city: 'Seattle', population: 737015, county: 'King County', zipCodes: ['98101', '98102', '98103', '98104'] },
      { city: 'Spokane', population: 228989, county: 'Spokane County', zipCodes: ['99201', '99202', '99203', '99204'] },
      { city: 'Tacoma', population: 219346, county: 'Pierce County', zipCodes: ['98401', '98402', '98403', '98404'] },
      { city: 'Vancouver', population: 185478, county: 'Clark County', zipCodes: ['98660', '98661', '98662', '98663'] },
      { city: 'Bellevue', population: 151854, county: 'King County', zipCodes: ['98004', '98005', '98006', '98007'] },
      { city: 'Kent', population: 136588, county: 'King County', zipCodes: ['98030', '98031', '98032', '98042'] },
      { city: 'Renton', population: 106785, county: 'King County', zipCodes: ['98055', '98056', '98057', '98058'] },
      { city: 'Everett', population: 113900, county: 'Snohomish County', zipCodes: ['98201', '98203', '98204', '98208'] },
      { city: 'Spokane Valley', population: 102976, county: 'Spokane County', zipCodes: ['99016', '99037', '99206', '99212'] },
      { city: 'Federal Way', population: 101030, county: 'King County', zipCodes: ['98003', '98023', '98093', '98148'] }
    ],
    'Nevada': [
      { city: 'Las Vegas', population: 651319, county: 'Clark County', zipCodes: ['89101', '89102', '89103', '89104'] },
      { city: 'Henderson', population: 320189, county: 'Clark County', zipCodes: ['89002', '89011', '89012', '89014'] },
      { city: 'Reno', population: 264165, county: 'Washoe County', zipCodes: ['89501', '89502', '89503', '89506'] },
      { city: 'North Las Vegas', population: 262527, county: 'Clark County', zipCodes: ['89030', '89031', '89032', '89084'] },
      { city: 'Sparks', population: 105006, county: 'Washoe County', zipCodes: ['89431', '89434', '89435', '89436'] },
      { city: 'Carson City', population: 58639, county: 'Carson City County', zipCodes: ['89701', '89702', '89703', '89706'] }
    ],
    'Alaska': [
      { city: 'Anchorage', population: 291247, county: 'Anchorage Municipality', zipCodes: ['99501', '99502', '99503', '99504'] },
      { city: 'Fairbanks', population: 31516, county: 'Fairbanks North Star Borough', zipCodes: ['99701', '99702', '99703', '99706'] },
      { city: 'Juneau', population: 32255, county: 'Juneau City and Borough', zipCodes: ['99801', '99802', '99803', '99811'] }
    ]
  };

  async generateCityKeywords(city: string, state: string): Promise<THCAKeywordSet> {
    const prompt = `Generate comprehensive THCA keywords for ${city}, ${state}. Create:

1. Primary Keywords (8-12 keywords):
- Buy THCA ${city}
- THCA flower ${city}  
- THCA delivery ${city}
- Legal THCA ${city}
- THCA dispensary ${city}
- THCA store ${city}
- ${city} THCA products
- THCA ${city} ${state}

2. Long-tail Keywords (10-15 keywords):
- Where to buy THCA in ${city}
- Best THCA dispensary ${city}
- THCA flower delivery ${city}
- Premium THCA ${city}
- Lab tested THCA ${city}
- THCA pre rolls ${city}
- THCA gummies ${city}
- High quality THCA ${city}

3. Local Variations (8-10 keywords):
- THCA near me ${city}
- ${city} hemp dispensary
- Cannabis ${city}
- Hemp products ${city}
- THC alternative ${city}

4. Commercial Keywords (6-8 keywords):
- THCA deals ${city}
- Cheap THCA ${city}
- THCA coupons ${city}
- THCA sale ${city}

5. Urgent Keywords (4-6 keywords):
- Same day THCA delivery ${city}
- Fast THCA ${city}
- 24 hour THCA ${city}

6. SEO Title (under 60 characters)
7. Meta Description (under 160 characters)
8. H1 Tag
9. Content outline with 5-7 main topics

Format as JSON with arrays for each keyword category.`;

    try {
      const response = await this.groq.generateContent(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error(`Error generating keywords for ${city}, ${state}:`, error);
      return this.generateFallbackKeywords(city, state);
    }
  }

  private generateFallbackKeywords(city: string, state: string): THCAKeywordSet {
    return {
      city,
      state,
      primaryKeywords: [
        `Buy THCA ${city}`,
        `THCA flower ${city}`,
        `THCA delivery ${city}`,
        `Legal THCA ${city}`,
        `THCA dispensary ${city}`,
        `THCA store ${city}`,
        `${city} THCA products`,
        `THCA ${city} ${state}`
      ],
      longTailKeywords: [
        `Where to buy THCA in ${city}`,
        `Best THCA dispensary ${city}`,
        `THCA flower delivery ${city}`,
        `Premium THCA ${city}`,
        `Lab tested THCA ${city}`,
        `THCA pre rolls ${city}`,
        `THCA gummies ${city}`,
        `High quality THCA ${city}`,
        `THCA vape ${city}`,
        `Organic THCA ${city}`
      ],
      localVariations: [
        `THCA near me ${city}`,
        `${city} hemp dispensary`,
        `Cannabis ${city}`,
        `Hemp products ${city}`,
        `THC alternative ${city}`,
        `${city} marijuana dispensary`,
        `Weed delivery ${city}`,
        `${city} cannabis store`
      ],
      commercialKeywords: [
        `THCA deals ${city}`,
        `Cheap THCA ${city}`,
        `THCA coupons ${city}`,
        `THCA sale ${city}`,
        `Discount THCA ${city}`,
        `THCA specials ${city}`
      ],
      urgentKeywords: [
        `Same day THCA delivery ${city}`,
        `Fast THCA ${city}`,
        `24 hour THCA ${city}`,
        `Emergency THCA ${city}`
      ],
      seoTitle: `Buy THCA in ${city}, ${state} | Premium Hemp Products`,
      metaDescription: `Shop premium THCA products in ${city}, ${state}. Lab-tested flower, gummies & more. Fast delivery available. Legal hemp-derived THCA.`,
      h1Tag: `Premium THCA Products in ${city}, ${state}`,
      contentOutline: [
        `THCA Laws and Legality in ${city}`,
        `Best THCA Dispensaries Near ${city}`,
        `THCA Product Types Available in ${city}`,
        `THCA Delivery Options in ${city}`,
        `Why Choose Lab-Tested THCA Products`,
        `THCA vs THC: What ${city} Residents Need to Know`,
        `Customer Reviews from ${city} THCA Users`
      ]
    };
  }

  async generateBulkCityKeywords(state?: string, minPopulation: number = 50000): Promise<THCAKeywordSet[]> {
    const results: THCAKeywordSet[] = [];
    const statesToProcess = state ? [state] : Object.keys(this.legalCitiesByState);

    for (const stateName of statesToProcess) {
      const cities = this.legalCitiesByState[stateName as keyof typeof this.legalCitiesByState] || [];
      const filteredCities = cities.filter(city => city.population >= minPopulation);

      console.log(`Generating keywords for ${filteredCities.length} cities in ${stateName}...`);

      for (const cityData of filteredCities) {
        try {
          const keywords = await this.generateCityKeywords(cityData.city, stateName);
          results.push(keywords);
          console.log(`✓ Generated keywords for ${cityData.city}, ${stateName}`);
          
          // Rate limiting to avoid API overload
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to generate keywords for ${cityData.city}, ${stateName}:`, error);
        }
      }
    }

    return results;
  }

  async generateCityLandingPage(keywords: THCAKeywordSet): Promise<string> {
    const prompt = `Create a comprehensive THCA landing page for ${keywords.city}, ${keywords.state}. Include:

1. Hero section with local focus
2. Product showcase relevant to ${keywords.city}
3. Local benefits (delivery, laws, etc.)
4. Trust signals (lab testing, legal compliance)
5. FAQ section for ${keywords.city} residents
6. Call-to-action buttons
7. Local SEO optimization

Target keywords: ${keywords.primaryKeywords.join(', ')}
Content should be 1500+ words, engaging, and locally relevant.
Include semantic HTML with proper heading structure.`;

    try {
      return await this.groq.generateContent(prompt);
    } catch (error) {
      console.error(`Error generating landing page for ${keywords.city}:`, error);
      return this.generateFallbackLandingPage(keywords);
    }
  }

  private generateFallbackLandingPage(keywords: THCAKeywordSet): string {
    return `
      <article>
        <h1>${keywords.h1Tag}</h1>
        
        <section>
          <h2>Legal THCA Products in ${keywords.city}</h2>
          <p>Welcome to your trusted source for premium THCA products in ${keywords.city}, ${keywords.state}. 
          Our lab-tested, hemp-derived THCA products are federally legal and available for fast delivery 
          throughout ${keywords.city}.</p>
        </section>

        <section>
          <h2>Why Choose Our THCA Products in ${keywords.city}</h2>
          <ul>
            <li>Lab-tested for purity and potency</li>
            <li>Fast delivery throughout ${keywords.city}</li>
            <li>Federally legal hemp-derived THCA</li>
            <li>Premium quality guarantee</li>
            <li>Local customer support</li>
          </ul>
        </section>

        <section>
          <h2>THCA Product Selection for ${keywords.city} Residents</h2>
          <p>Browse our extensive selection of THCA products, including flower, pre-rolls, gummies, 
          and vape cartridges. All products ship quickly to ${keywords.city} with discrete packaging.</p>
        </section>

        <section>
          <h2>THCA Delivery in ${keywords.city}</h2>
          <p>Enjoy fast, reliable THCA delivery throughout ${keywords.city} and surrounding areas. 
          Most orders arrive within 2-3 business days with tracking information provided.</p>
        </section>
      </article>
    `;
  }

  getAllLegalCities(): Array<{city: string, state: string, population: number}> {
    const allCities: Array<{city: string, state: string, population: number}> = [];
    
    Object.entries(this.legalCitiesByState).forEach(([state, cities]) => {
      cities.forEach(city => {
        allCities.push({
          city: city.city,
          state: state,
          population: city.population
        });
      });
    });

    return allCities.sort((a, b) => b.population - a.population);
  }

  getTotalKeywordCount(keywordSets: THCAKeywordSet[]): number {
    return keywordSets.reduce((total, set) => {
      return total + 
        set.primaryKeywords.length + 
        set.longTailKeywords.length + 
        set.localVariations.length + 
        set.commercialKeywords.length + 
        set.urgentKeywords.length;
    }, 0);
  }
}