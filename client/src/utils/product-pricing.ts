// Product pricing logic utilities

export interface PricingConfig {
  useQuantityScaling: boolean;
  showWeightOptions: boolean;
  basePrice: number;
  quantityMultiplier: number;
}

/**
 * Determines pricing structure for a product based on its name and category
 */
export function getProductPricingConfig(productName: string, category: string): PricingConfig {
  const name = productName.toLowerCase();
  
  // Check if it's a pre-roll - these keep current behavior with weight options
  if (name.includes('pre roll') || name.includes('preroll') || category === 'prerolls') {
    return {
      useQuantityScaling: false,
      showWeightOptions: true,
      basePrice: 0,
      quantityMultiplier: 1
    };
  }
  
  // Check if product name already specifies weight - these use quantity scaling only
  const weightIndicators = [
    'gram', 'g ', ' g', 'half', 'quarter', 'eighth', 'ounce', 'oz',
    '1g', '3.5g', '7g', '14g', '28g', 
    '1 gram', '3.5 gram', '7 gram', '14 gram', '28 gram',
    'half ounce', 'quarter ounce', 'eighth ounce'
  ];
  
  const hasWeightInName = weightIndicators.some(indicator => name.includes(indicator));
  
  if (hasWeightInName) {
    return {
      useQuantityScaling: true,
      showWeightOptions: false,
      basePrice: 0,
      quantityMultiplier: 1
    };
  }
  
  // For standalone strain names without weight, allow weight options
  return {
    useQuantityScaling: false,
    showWeightOptions: true,
    basePrice: 0,
    quantityMultiplier: 1
  };
}

/**
 * Calculate quantity-scaled pricing
 */
export function calculateQuantityPrice(basePrice: number, quantity: number): number {
  // Volume discounts for quantity scaling
  const discountTiers = [
    { minQty: 10, discount: 0.15 }, // 15% off for 10+
    { minQty: 5, discount: 0.10 },  // 10% off for 5+
    { minQty: 3, discount: 0.05 }   // 5% off for 3+
  ];
  
  const applicableDiscount = discountTiers.find(tier => quantity >= tier.minQty);
  const discount = applicableDiscount ? applicableDiscount.discount : 0;
  
  return basePrice * quantity * (1 - discount);
}

/**
 * Generate quantity options for products using quantity scaling
 */
export function getQuantityOptions(maxQuantity: number = 20): Array<{ value: number; label: string; discount?: string }> {
  const options = [
    { value: 1, label: '1 unit' },
    { value: 2, label: '2 units' },
    { value: 3, label: '3 units', discount: '5% off' },
    { value: 5, label: '5 units', discount: '10% off' },
    { value: 10, label: '10 units', discount: '15% off' }
  ];
  
  return options.filter(option => option.value <= maxQuantity);
}