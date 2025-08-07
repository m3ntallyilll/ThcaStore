import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from './use-toast';
import { 
  getStoredReferralCode, 
  clearStoredReferralCode,
  processReferralFromURL,
  generateReferralLink 
} from '@/lib/referral-utils';

interface ReferralInfo {
  valid: boolean;
  referrerReward?: number;
  refereeReward?: number;
  message?: string;
}

interface UserReferralData {
  referralCode?: string;
  hasUsedReferral?: boolean;
  stats?: any;
  totalReferrals?: number;
  totalEarned?: number;
}

export function useReferral() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [pendingReferralCode, setPendingReferralCode] = useState<string | null>(null);

  // Process URL referral on component mount
  useEffect(() => {
    const result = processReferralFromURL();
    
    if (result.hasReferral && result.isNew) {
      toast({
        title: "Referral Detected! 🎉",
        description: `Code ${result.code} has been saved. You'll get bonus points when you sign up!`,
        duration: 5000,
      });
      setPendingReferralCode(result.code!);
    } else if (result.hasReferral) {
      setPendingReferralCode(result.code!);
    }
  }, [toast]);

  // Get user's own referral info
  const { data: userReferralData } = useQuery<UserReferralData>({
    queryKey: ['/api/referrals/user'],
    enabled: !!user,
    retry: false,
  });

  // Get stored referral code for new users
  const storedReferralCode = getStoredReferralCode();

  // Validate referral code
  const validateReferralMutation = useMutation<ReferralInfo, Error, string>({
    mutationFn: async (code: string): Promise<ReferralInfo> => {
      const response = await apiRequest('POST', '/api/referrals/validate', { code });
      return response.json();
    },
  });

  // Apply referral code
  const applyReferralMutation = useMutation<any, Error, string | undefined>({
    mutationFn: async (code?: string) => {
      const referralCode = code || storedReferralCode;
      if (!referralCode) throw new Error('No referral code to apply');
      
      const response = await apiRequest('POST', '/api/referrals/apply', { 
        referralCode 
      });
      return response.json();
    },
    onSuccess: (data) => {
      clearStoredReferralCode();
      setPendingReferralCode(null);
      queryClient.invalidateQueries({ queryKey: ['/api/referrals/user'] });
      
      toast({
        title: "Referral Applied! 🎉",
        description: `You've received ${data.points || data.refereeReward || 0} bonus points!`,
        duration: 5000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Referral Application Failed",
        description: error.message || "Unable to apply referral code",
        variant: "destructive",
      });
    },
  });

  // Auto-apply referral when user logs in and has pending referral
  useEffect(() => {
    if (user && storedReferralCode && !userReferralData?.hasUsedReferral) {
      // Small delay to ensure user is fully authenticated
      const timer = setTimeout(() => {
        applyReferralMutation.mutate();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user, storedReferralCode, userReferralData, applyReferralMutation]);

  // Generate user's referral link
  const generateUserReferralLink = () => {
    if (!userReferralData?.referralCode) return '';
    return generateReferralLink(userReferralData.referralCode);
  };

  // Copy referral link to clipboard
  const copyReferralLink = async () => {
    const link = generateUserReferralLink();
    if (!link) return false;
    
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link Copied! 📋",
        description: "Your referral link has been copied to clipboard",
      });
      return true;
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please copy manually.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    // Referral state
    pendingReferralCode,
    storedReferralCode,
    userReferralData,
    hasActiveReferral: !!storedReferralCode,
    
    // Mutations
    validateReferral: validateReferralMutation.mutate,
    applyReferral: applyReferralMutation.mutate,
    isValidating: validateReferralMutation.isPending,
    isApplying: applyReferralMutation.isPending,
    
    // Utilities
    generateUserReferralLink,
    copyReferralLink,
    clearStoredReferral: clearStoredReferralCode,
    
    // Data
    referralStats: userReferralData?.stats,
    userReferralCode: userReferralData?.referralCode,
    totalReferrals: userReferralData?.totalReferrals || 0,
    totalEarned: userReferralData?.totalEarned || 0,
  };
}