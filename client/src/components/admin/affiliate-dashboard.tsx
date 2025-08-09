import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Copy, DollarSign, Users, MousePointer, TrendingUp, Plus, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function AffiliateDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '10',
    minPurchase: '0',
    maxUses: '',
    expiresAt: '',
    description: '',
  });

  // Fetch referral data
  const { data: referralData, isLoading } = useQuery({
    queryKey: ['/api/affiliate/my-affiliate'],
  });

  // Create promo code mutation
  const createPromoMutation = useMutation({
    mutationFn: async (promoData: any) => {
      return apiRequest('/api/affiliate/create-promo', {
        method: 'POST',
        body: promoData,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Promo Code Created',
        description: 'Your new promo code has been created successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/affiliate/my-affiliate'] });
      setIsCreatingPromo(false);
      setNewPromo({
        code: '',
        discountType: 'percentage',
        discountValue: '10',
        minPurchase: '0',
        maxUses: '',
        expiresAt: '',
        description: '',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create promo code',
        variant: 'destructive',
      });
    },
  });

  const handleCopyLink = () => {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink);
      toast({
        title: 'Link Copied!',
        description: 'Your referral link has been copied to clipboard.',
      });
    }
  };

  const handleCreatePromo = () => {
    if (!newPromo.code.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a promo code',
        variant: 'destructive',
      });
      return;
    }

    createPromoMutation.mutate({
      ...newPromo,
      maxUses: newPromo.maxUses ? parseInt(newPromo.maxUses) : null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Referral Program</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleCopyLink}
            className="bg-green-600 hover:bg-green-700"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Referral Link
          </Button>
          <Dialog open={isCreatingPromo} onOpenChange={setIsCreatingPromo}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Promo Code
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border-gray-800">
              <DialogHeader>
                <DialogTitle>Create New Promo Code</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="code">Promo Code</Label>
                  <Input
                    id="code"
                    value={newPromo.code}
                    onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                    placeholder="SAVE20"
                    className="bg-gray-800 border-gray-700"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Leave blank to auto-generate based on your affiliate code
                  </p>
                </div>

                <div>
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select
                    value={newPromo.discountType}
                    onValueChange={(value) => setNewPromo({ ...newPromo, discountType: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discountValue">
                    Discount Value {newPromo.discountType === 'percentage' ? '(%)' : '($)'}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={newPromo.discountValue}
                    onChange={(e) => setNewPromo({ ...newPromo, discountValue: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="minPurchase">Minimum Purchase ($)</Label>
                  <Input
                    id="minPurchase"
                    type="number"
                    value={newPromo.minPurchase}
                    onChange={(e) => setNewPromo({ ...newPromo, minPurchase: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="maxUses">Max Uses (Leave blank for unlimited)</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={newPromo.maxUses}
                    onChange={(e) => setNewPromo({ ...newPromo, maxUses: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="expiresAt">Expiration Date</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={newPromo.expiresAt}
                    onChange={(e) => setNewPromo({ ...newPromo, expiresAt: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newPromo.description}
                    onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                    placeholder="Special offer for new customers"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <Button
                  onClick={handleCreatePromo}
                  disabled={createPromoMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {createPromoMutation.isPending ? 'Creating...' : 'Create Promo Code'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Affiliate Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${referralData?.totalEarnings || '0.00'}
            </div>
            <p className="text-xs text-gray-500">
              {referralData?.commissionRate}% commission rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${referralData?.availableBalance || '0.00'}
            </div>
            <p className="text-xs text-gray-500">Ready for payout</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {referralData?.totalClicks || 0}
            </div>
            <p className="text-xs text-gray-500">Link visits</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {referralData?.totalConversions || 0}
            </div>
            <p className="text-xs text-gray-500">
              {referralData?.totalClicks > 0
                ? `${((referralData?.totalConversions / referralData?.totalClicks) * 100).toFixed(1)}% rate`
                : 'No clicks yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Link className="w-5 h-5" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={referralData?.referralLink || ''}
              readOnly
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Button onClick={handleCopyLink} variant="outline">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Share this link to help grow our app and earn {referralData?.commissionRate}% commission on referred sales
          </p>
        </CardContent>
      </Card>

      {/* Promo Codes Section */}
      {referralData?.promoCodes?.length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Your Promo Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referralData.promoCodes.map((promo: any) => (
                <div
                  key={promo.id}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-mono font-bold text-white">{promo.code}</p>
                    <p className="text-sm text-gray-400">
                      {promo.discountType === 'percentage'
                        ? `${promo.discountValue}% off`
                        : promo.discountType === 'fixed'
                        ? `$${promo.discountValue} off`
                        : 'Free shipping'}
                      {promo.minPurchase > 0 && ` • Min $${promo.minPurchase}`}
                      {promo.maxUses && ` • ${promo.currentUses}/${promo.maxUses} used`}
                    </p>
                    {promo.description && (
                      <p className="text-xs text-gray-500 mt-1">{promo.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        promo.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(promo.code);
                        toast({
                          title: 'Code Copied!',
                          description: `${promo.code} copied to clipboard`,
                        });
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversion Stats */}
      {affiliateData?.stats && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Conversion Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-white font-bold text-xl">{affiliateData.stats.total}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-yellow-500 font-bold text-xl">{affiliateData.stats.pending}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Approved</p>
                <p className="text-green-500 font-bold text-xl">{affiliateData.stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}