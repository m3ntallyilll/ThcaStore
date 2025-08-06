import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Trash2, Package, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Product, ProductVariant } from '@shared/schema';

const PRODUCT_CATEGORIES = {
  flower: {
    weights: ['1g', '3.5g', '7g', '14g', '28g'],
    subcategories: ['indica', 'sativa', 'hybrid']
  },
  prerolls: {
    weights: ['1.1g', '1.25g', '1.45g', '1.5g'],
    subcategories: ['single', 'pack', 'infused']
  },
  concentrates: {
    weights: ['0.5g', '1g', '2g'],
    subcategories: ['wax', 'shatter', 'live_resin', 'rosin']
  },
  edibles: {
    weights: ['100mg', '250mg', '500mg', '1000mg'],
    subcategories: ['gummies', 'chocolates', 'beverages']
  }
} as const;

interface ProductVariantManagerProps {
  product: Product;
  onProductUpdate: (updatedProduct: Product) => void;
}

export function ProductVariantManager({ product, onProductUpdate }: ProductVariantManagerProps) {
  const [variants, setVariants] = useState<ProductVariant[]>(product.variants || []);
  const [subcategory, setSubcategory] = useState(product.subcategory || '');
  const [potency, setPotency] = useState(product.potency || 'Medium');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get available weights and subcategories for the product category
  const categoryData = PRODUCT_CATEGORIES[product.category as keyof typeof PRODUCT_CATEGORIES];
  const availableWeights = categoryData?.weights || ['1g', '3.5g', '7g'];
  const availableSubcategories = categoryData?.subcategories || [];

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `variant-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      weight: availableWeights[0],
      price: parseFloat(product.price),
      stock: 10,
      isDefault: variants.length === 0
    };
    setVariants([...variants, newVariant]);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    
    // Ensure only one default variant
    if (field === 'isDefault' && value === true) {
      updated.forEach((v, i) => {
        if (i !== index) v.isDefault = false;
      });
    }
    
    setVariants(updated);
  };

  const removeVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index);
    
    // Ensure we still have a default variant
    if (updated.length > 0 && !updated.some(v => v.isDefault)) {
      updated[0].isDefault = true;
    }
    
    setVariants(updated);
  };

  const saveChanges = async () => {
    setIsLoading(true);
    
    try {
      // Calculate price range
      const prices = variants.map(v => v.price);
      const priceRange = variants.length > 0 ? {
        min: Math.min(...prices),
        max: Math.max(...prices)
      } : { min: parseFloat(product.price), max: parseFloat(product.price) };

      const updatedProduct = await apiRequest(`/api/products/${product.id}`, {
        method: 'PATCH',
        body: {
          variants,
          subcategory,
          potency,
          priceRange
        }
      });

      onProductUpdate(updatedProduct);
      toast({
        title: "Success",
        description: "Product variants updated successfully!",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product variants",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-800/50 rounded-lg border border-gray-600">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Package className="w-5 h-5" />
          Product Variants & Categories
        </h3>
        <Button
          onClick={saveChanges}
          disabled={isLoading}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Category Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Subcategory
          </label>
          <Select value={subcategory} onValueChange={setSubcategory}>
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {availableSubcategories.map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub.replace('_', ' ').toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Potency Level
          </label>
          <Select value={potency} onValueChange={setPotency}>
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select potency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low (Under 18%)</SelectItem>
              <SelectItem value="Medium">Medium (18-24%)</SelectItem>
              <SelectItem value="High">High (25%+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Variants List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">Size & Weight Variants</h4>
          <Button
            onClick={addVariant}
            variant="outline"
            size="sm"
            className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Variant
          </Button>
        </div>

        <div className="space-y-3">
          {variants.map((variant, index) => (
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-12 gap-3 items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600"
            >
              {/* Weight */}
              <div className="col-span-3">
                <Select
                  value={variant.weight}
                  onValueChange={(value) => updateVariant(index, 'weight', value)}
                >
                  <SelectTrigger className="bg-gray-600 border-gray-500 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWeights.map((weight) => (
                      <SelectItem key={weight} value={weight}>
                        {weight}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="col-span-3">
                <Input
                  type="number"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
                  className="bg-gray-600 border-gray-500 text-sm"
                  placeholder="Price"
                />
              </div>

              {/* Stock */}
              <div className="col-span-2">
                <Input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value))}
                  className="bg-gray-600 border-gray-500 text-sm"
                  placeholder="Stock"
                />
              </div>

              {/* Default */}
              <div className="col-span-2 flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={variant.isDefault}
                  onChange={(e) => updateVariant(index, 'isDefault', e.target.checked)}
                  className="w-4 h-4 text-emerald-500 bg-gray-600 border-gray-500 rounded focus:ring-emerald-500"
                />
                <span className="ml-2 text-xs text-gray-300">Default</span>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex justify-end">
                <Button
                  onClick={() => removeVariant(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}

          {variants.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No variants configured. Add variants to enable size and weight options.</p>
            </div>
          )}
        </div>
      </div>

      {/* Price Range Preview */}
      {variants.length > 1 && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-400">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold">Price Range: </span>
            <span>
              ${Math.min(...variants.map(v => v.price))} - ${Math.max(...variants.map(v => v.price))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}