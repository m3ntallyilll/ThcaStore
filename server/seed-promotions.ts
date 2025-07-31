import { storage } from './database-storage';

const weeklyPromotions = [
  {
    dayOfWeek: 0, // Sunday
    title: "Sunday Starter Pack",
    description: "Get your week rolling with premium pre-rolls! Buy 2 pre-rolls and get the 3rd one FREE. Perfect for Sunday session prep.",
    discountType: "bogo",
    discountValue: "33.33",
    minPurchase: "30.00",
    maxDiscount: "15.00",
    applicableCategories: ["flower"],
    stackableWithOthers: false,
    startTime: "10:00",
    endTime: "20:00"
  },
  {
    dayOfWeek: 1, // Monday
    title: "Mellow Monday",
    description: "Beat the Monday blues with 20% off all indica strains and relaxing edibles. Start your week chill.",
    discountType: "percentage",
    discountValue: "20.00",
    minPurchase: "25.00",
    maxDiscount: "50.00",
    applicableCategories: ["flower", "edibles"],
    stackableWithOthers: true,
    startTime: "00:00",
    endTime: "23:59"
  },
  {
    dayOfWeek: 2, // Tuesday
    title: "Terpene Tuesday",
    description: "Concentrate connoisseurs rejoice! 25% off all concentrates, wax, shatter, and live resin. Flavor explosion day!",
    discountType: "percentage",
    discountValue: "25.00",
    minPurchase: "40.00",
    maxDiscount: "75.00",
    applicableCategories: ["concentrates"],
    stackableWithOthers: true,
    startTime: "00:00",
    endTime: "23:59"
  },
  {
    dayOfWeek: 3, // Wednesday
    title: "Wake & Bake Wednesday",
    description: "Rise and grind! 15% off all sativa strains and energizing products. Perfect for mid-week motivation.",
    discountType: "percentage",
    discountValue: "15.00",
    minPurchase: "20.00",
    maxDiscount: "30.00",
    applicableCategories: ["flower"],
    stackableWithOthers: true,
    startTime: "06:00",
    endTime: "12:00"
  },
  {
    dayOfWeek: 4, // Thursday
    title: "Throwback Thursday",
    description: "Classic strains at throwback prices! $10 off any purchase over $60. Old school vibes, new school quality.",
    discountType: "fixed",
    discountValue: "10.00",
    minPurchase: "60.00",
    maxDiscount: "10.00",
    applicableCategories: [],
    stackableWithOthers: false,
    startTime: "00:00",
    endTime: "23:59"
  },
  {
    dayOfWeek: 5, // Friday
    title: "TGIF - Thank Green It's Friday",
    description: "Weekend warrior special! 30% off edibles and party-ready products. Let the good times roll!",
    discountType: "percentage",
    discountValue: "30.00",
    minPurchase: "35.00",
    maxDiscount: "100.00",
    applicableCategories: ["edibles"],
    stackableWithOthers: true,
    startTime: "15:00",
    endTime: "23:59"
  },
  {
    dayOfWeek: 6, // Saturday
    title: "Stoned Saturday",
    description: "Weekend blowout sale! Buy any 2 products and get 40% off the lower-priced item. Mix and match madness!",
    discountType: "bogo",
    discountValue: "40.00",
    minPurchase: "50.00",
    maxDiscount: "80.00",
    applicableCategories: [],
    stackableWithOthers: false,
    startTime: "10:00",
    endTime: "22:00"
  }
];

export async function seedDailyPromotions() {
  console.log('Seeding daily promotions...');
  
  try {
    // Clear existing promotions
    const existingPromotions = await storage.getDailyPromotions();
    for (const promo of existingPromotions) {
      await storage.deleteDailyPromotion(promo.id);
    }
    
    // Create new promotions
    for (const promo of weeklyPromotions) {
      await storage.createDailyPromotion(promo);
      console.log(`Created promotion: ${promo.title}`);
    }
    
    console.log('Daily promotions seeded successfully!');
  } catch (error) {
    console.error('Error seeding promotions:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedDailyPromotions().then(() => process.exit(0));
}