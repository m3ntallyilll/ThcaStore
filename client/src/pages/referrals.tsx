import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Users, DollarSign, TrendingUp, Gift, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Helmet } from 'react-helmet-async';

interface AffiliateData {
  id: string;
  affiliateCode: string;
  commissionRate: string;
  totalEarnings: string;
  availableBalance: string;
  totalClicks: number;
  totalConversions: number;
  isActive: boolean;
  stats: {
    total: number;
    pending: number;
    approved: number;
    totalEarnings: number;
  };
  promoCodes: any[];
  referralLink: string;
}

export default function ReferralsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPromoCode, setNewPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('10');

  // Fetch affiliate data
  const { data: affiliateData, isLoading } = useQuery<AffiliateData>({
    queryKey: ['/api/affiliate/my-affiliate'],
    enabled: !!user,
    retry: false,
  });

  // Copy referral link
  const copyReferralLink = async () => {
    if (!affiliateData?.referralLink) return;
    
    try {
      await navigator.clipboard.writeText(affiliateData.referralLink);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = affiliateData.referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    }
  };

  // Create promo code
  const createPromoMutation = useMutation({
    mutationFn: async ({ code, discountValue }: { code: string; discountValue: string }) => {
      const response = await apiRequest('POST', '/api/affiliate/create-promo', {
        code: code || undefined,
        discountType: 'percentage',
        discountValue,
        description: `${discountValue}% off with ${code || 'auto-generated code'}`,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Promo Code Created!",
        description: "Your new promo code is ready to share",
      });
      setNewPromoCode('');
      setPromoDiscount('10');
      queryClient.invalidateQueries({ queryKey: ['/api/affiliate/my-affiliate'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create promo code",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>You need to be signed in to view your referral dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800">
      <Helmet>
        <title>Referral Dashboard - Mentally-Chill</title>
        <meta name="description" content="Manage your referral program, track earnings, and create promo codes" />
        <meta property="og:title" content="Referral Dashboard - Mentally-Chill" />
        <meta property="og:description" content="Manage your referral program, track earnings, and create promo codes" />
        <meta property="og:image" content="https://mentally-chill.online/social-thumbnail.png" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Referral Dashboard</h1>
          <p className="text-gray-400">Share your link and earn commissions on every sale</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-dark-800 border-dark-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Clicks</p>
                  <p className="text-2xl font-bold text-white">{affiliateData?.totalClicks || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-dark-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Conversions</p>
                  <p className="text-2xl font-bold text-white">{affiliateData?.totalConversions || 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-dark-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Earnings</p>
                  <p className="text-2xl font-bold text-white">${affiliateData?.totalEarnings || '0.00'}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-dark-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Commission Rate</p>
                  <p className="text-2xl font-bold text-white">{affiliateData?.commissionRate || '10'}%</p>
                </div>
                <Gift className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Referral Link */}
          <Card className="bg-dark-800 border-dark-700">
            <CardHeader>
              <CardTitle className="text-white">Your Referral Link</CardTitle>
              <CardDescription>Share this link to earn commissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={affiliateData?.referralLink || ''}
                  readOnly
                  className="bg-dark-700 border-dark-600 text-white"
                />
                <Button onClick={copyReferralLink} variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Code: {affiliateData?.affiliateCode}</Badge>
                <Badge variant={affiliateData?.isActive ? "default" : "destructive"}>
                  {affiliateData?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Create Promo Code */}
          <Card className="bg-dark-800 border-dark-700">
            <CardHeader>
              <CardTitle className="text-white">Create Promo Code</CardTitle>
              <CardDescription>Generate custom discount codes for your referrals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="promoCode" className="text-white">Custom Code (optional)</Label>
                <Input
                  id="promoCode"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                  placeholder="Leave empty for auto-generation"
                  className="bg-dark-700 border-dark-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount" className="text-white">Discount Percentage</Label>
                <Input
                  id="discount"
                  type="number"
                  value={promoDiscount}
                  onChange={(e) => setPromoDiscount(e.target.value)}
                  min="1"
                  max="50"
                  className="bg-dark-700 border-dark-600 text-white"
                />
              </div>
              <Button
                onClick={() => createPromoMutation.mutate({ code: newPromoCode, discountValue: promoDiscount })}
                disabled={createPromoMutation.isPending}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                {createPromoMutation.isPending ? 'Creating...' : 'Create Promo Code'}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Promo Codes */}
          <Card className="bg-dark-800 border-dark-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Your Promo Codes</CardTitle>
              <CardDescription>Manage your existing promotional codes</CardDescription>
            </CardHeader>
            <CardContent>
              {affiliateData?.promoCodes?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {affiliateData.promoCodes.map((promo: any) => (
                    <Card key={promo.id} className="bg-dark-700 border-dark-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="font-mono">{promo.code}</Badge>
                          <Badge variant={promo.isActive ? "default" : "secondary"}>
                            {promo.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{promo.discountValue}% discount</p>
                        <p className="text-xs text-gray-500 mt-1">Used: {promo.currentUses || 0} times</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No promo codes created yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}