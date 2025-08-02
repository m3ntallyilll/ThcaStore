import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, Percent, DollarSign, Tag, TrendingUp, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minPurchase: number;
  maxUses: number | null;
  currentUses: number;
  isActive: boolean;
  expiresAt: string | null;
  applicableCategories: string[];
  description: string;
  createdAt: string;
}

export function PromoCodeManager() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Fetch promo codes
  const { data: promoCodes = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/promo-codes'],
    queryFn: () => apiRequest('/api/admin/promo-codes')
  });

  // Create promo code mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/admin/promo-codes', {
      method: 'POST',
      body: data
    }),
    onSuccess: () => {
      toast({ title: 'Promo code created successfully!' });
      setIsCreateOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error creating promo code', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const handleCreatePromo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const data = {
      code: formData.get('code') || undefined, // Let backend generate if empty
      discountType: formData.get('discountType'),
      discountValue: parseFloat(formData.get('discountValue') as string),
      minPurchase: parseFloat(formData.get('minPurchase') as string) || 0,
      maxUses: formData.get('maxUses') ? parseInt(formData.get('maxUses') as string) : null,
      expiresAt: formData.get('expiresAt') || null,
      applicableCategories: formData.get('categories') ? 
        (formData.get('categories') as string).split(',').map(c => c.trim()).filter(Boolean) : [],
      description: formData.get('description')
    };

    createMutation.mutate(data);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({ title: 'Promo code copied to clipboard!' });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const generateRandomCode = () => {
    const prefixes = ['HEMP', 'SAVE', 'DEAL', 'FIRE', 'CHILL'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.random().toString(36).substr(2, 4).toUpperCase();
    return prefix + suffix;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-emerald-400" />
            Promo Code Manager
          </h2>
          <p className="text-gray-400">Create and manage discount codes for your store</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Promo Code</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleCreatePromo} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-white">Code (leave empty to auto-generate)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      name="code"
                      placeholder="HEMP2025"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                        if (input) input.value = generateRandomCode();
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discountType" className="text-white">Discount Type</Label>
                  <Select name="discountType" required>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountValue" className="text-white">Discount Value</Label>
                  <Input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    step="0.01"
                    placeholder="10.00"
                    required
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minPurchase" className="text-white">Minimum Purchase ($)</Label>
                  <Input
                    id="minPurchase"
                    name="minPurchase"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxUses" className="text-white">Max Uses (leave empty for unlimited)</Label>
                  <Input
                    id="maxUses"
                    name="maxUses"
                    type="number"
                    placeholder="100"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiresAt" className="text-white">Expiration Date</Label>
                  <Input
                    id="expiresAt"
                    name="expiresAt"
                    type="datetime-local"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categories" className="text-white">Applicable Categories (comma-separated, leave empty for all)</Label>
                <Input
                  id="categories"
                  name="categories"
                  placeholder="flower, prerolls, concentrates"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Limited time offer - 15% off all flower products"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Promo Code'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded">
                <Tag className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Codes</p>
                <p className="text-2xl font-bold text-white">{promoCodes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Codes</p>
                <p className="text-2xl font-bold text-white">
                  {promoCodes.filter(p => p.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded">
                <Calendar className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Expiring Soon</p>
                <p className="text-2xl font-bold text-white">
                  {promoCodes.filter(p => {
                    if (!p.expiresAt) return false;
                    const expiry = new Date(p.expiresAt);
                    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                    return expiry <= weekFromNow;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded">
                <Percent className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Uses</p>
                <p className="text-2xl font-bold text-white">
                  {promoCodes.reduce((sum, p) => sum + p.currentUses, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promo Codes List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">All Promo Codes</h3>
        
        {promoCodes.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8 text-center">
              <Tag className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No promo codes yet</h3>
              <p className="text-gray-500 mb-4">Create your first promo code to start offering discounts to customers.</p>
              <Button onClick={() => setIsCreateOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Promo Code
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {promoCodes.map((promo: PromoCode) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-emerald-500/20 rounded">
                            {promo.discountType === 'percentage' ? (
                              <Percent className="w-5 h-5 text-emerald-400" />
                            ) : promo.discountType === 'fixed' ? (
                              <DollarSign className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <TrendingUp className="w-5 h-5 text-emerald-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-mono font-bold text-lg text-white">{promo.code}</h4>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopyCode(promo.code)}
                                className="h-6 w-6 p-0 hover:bg-gray-700"
                              >
                                {copiedCode === promo.code ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3 text-gray-400" />
                                )}
                              </Button>
                            </div>
                            <p className="text-sm text-gray-400">{promo.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={`${
                                promo.isActive 
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                  : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                              }`}
                            >
                              {promo.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {promo.discountType === 'percentage' 
                                ? `${promo.discountValue}% off`
                                : promo.discountType === 'fixed'
                                ? `$${promo.discountValue} off`
                                : 'Free shipping'
                              }
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {promo.currentUses} / {promo.maxUses || '∞'} uses
                          </div>
                          {promo.expiresAt && (
                            <div className="text-xs text-gray-500">
                              Expires: {new Date(promo.expiresAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/20">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {promo.applicableCategories.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Categories:</span>
                          {promo.applicableCategories.map((category) => (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}