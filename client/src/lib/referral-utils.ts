/**
 * Referral System Auto-Link Utilities
 * Automatically detects and stores referral codes from URLs
 */

export const REFERRAL_STORAGE_KEY = 'thca_referral_code';
export const REFERRAL_EXPIRY_KEY = 'thca_referral_expiry';

/**
 * Extract referral code from URL parameters
 * Supports multiple formats: ?ref=code, ?referral=code, ?invite=code
 */
export function extractReferralFromURL(): string | null {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check for different referral parameter names
  const referralCode = urlParams.get('ref') || 
                      urlParams.get('referral') || 
                      urlParams.get('invite') ||
                      urlParams.get('r');
  
  return referralCode ? referralCode.toUpperCase() : null;
}

/**
 * Store referral code with expiration (30 days)
 */
export function storeReferralCode(code: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 day expiry
    
    localStorage.setItem(REFERRAL_STORAGE_KEY, code.toUpperCase());
    localStorage.setItem(REFERRAL_EXPIRY_KEY, expiryDate.toISOString());
    
    console.log(`🎯 Referral code ${code} stored and will expire on ${expiryDate.toLocaleDateString()}`);
  } catch (error) {
    console.warn('Failed to store referral code:', error);
  }
}

/**
 * Retrieve stored referral code if it hasn't expired
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const code = localStorage.getItem(REFERRAL_STORAGE_KEY);
    const expiryStr = localStorage.getItem(REFERRAL_EXPIRY_KEY);
    
    if (!code || !expiryStr) return null;
    
    const expiry = new Date(expiryStr);
    const now = new Date();
    
    if (now > expiry) {
      // Expired, clean up
      clearStoredReferralCode();
      return null;
    }
    
    return code;
  } catch (error) {
    console.warn('Failed to retrieve referral code:', error);
    return null;
  }
}

/**
 * Clear stored referral code
 */
export function clearStoredReferralCode(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(REFERRAL_STORAGE_KEY);
    localStorage.removeItem(REFERRAL_EXPIRY_KEY);
  } catch (error) {
    console.warn('Failed to clear referral code:', error);
  }
}

/**
 * Generate shareable referral link
 */
export function generateReferralLink(referralCode: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://thcastore.com');
  return `${base}/?ref=${referralCode.toUpperCase()}`;
}

/**
 * Check if current URL has referral parameters and process them
 */
export function processReferralFromURL(): { 
  hasReferral: boolean; 
  code?: string; 
  isNew?: boolean;
} {
  const codeFromURL = extractReferralFromURL();
  
  if (!codeFromURL) {
    return { hasReferral: false };
  }
  
  const existingCode = getStoredReferralCode();
  const isNew = !existingCode || existingCode !== codeFromURL;
  
  if (isNew) {
    storeReferralCode(codeFromURL);
  }
  
  return {
    hasReferral: true,
    code: codeFromURL,
    isNew
  };
}

/**
 * Format referral code for display (adds dashes for readability)
 */
export function formatReferralCode(code: string): string {
  if (code.length <= 6) return code;
  
  // Add dashes for readability: ABC123DEF -> ABC-123-DEF
  return code.replace(/(.{3})/g, '$1-').slice(0, -1);
}

/**
 * Validate referral code format
 */
export function isValidReferralFormat(code: string): boolean {
  // Allow alphanumeric codes, 3-12 characters
  return /^[A-Z0-9]{3,12}$/.test(code.toUpperCase());
}