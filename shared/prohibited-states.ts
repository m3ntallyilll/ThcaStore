// Prohibited states for hemp THCA products
// These states have restrictions on hemp-derived THCA products

export const PROHIBITED_STATES = [
  'ID', // Idaho - Hemp THCA products prohibited
  'KS', // Kansas - Restrictions on hemp-derived THCA
  'SD', // South Dakota - Limited hemp regulations
  'WY', // Wyoming - Hemp THCA restrictions
] as const;

export const STATE_RESTRICTIONS = {
  'ID': {
    name: 'Idaho',
    prohibited: true,
    reason: 'Hemp-derived THCA products are not permitted in Idaho'
  },
  'KS': {
    name: 'Kansas', 
    prohibited: true,
    reason: 'Kansas has restrictions on hemp-derived THCA products'
  },
  'SD': {
    name: 'South Dakota',
    prohibited: true, 
    reason: 'South Dakota has limited hemp regulations that restrict THCA products'
  },
  'WY': {
    name: 'Wyoming',
    prohibited: true,
    reason: 'Wyoming prohibits hemp-derived THCA products'
  }
} as const;

export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' }
] as const;

export function isStateProhibited(stateCode: string): boolean {
  return PROHIBITED_STATES.includes(stateCode as any);
}

export function getStateRestriction(stateCode: string) {
  return STATE_RESTRICTIONS[stateCode as keyof typeof STATE_RESTRICTIONS];
}

export function getAvailableStates() {
  return US_STATES.filter(state => !isStateProhibited(state.code));
}