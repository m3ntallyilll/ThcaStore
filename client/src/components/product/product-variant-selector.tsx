import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ProductVariant } from '@shared/schema';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant) => void;
  selectedVariant?: ProductVariant;
}

export function ProductVariantSelector({ variants, onVariantChange, selectedVariant }: ProductVariantSelectorProps) {
  const [currentVariant, setCurrentVariant] = useState<ProductVariant>(
    selectedVariant || variants.find(v => v.isDefault) || variants[0]
  );

  useEffect(() => {
    if (currentVariant) {
      onVariantChange(currentVariant);
    }
  }, [currentVariant, onVariantChange]);

  if (!variants || variants.length === 0) {
    return null;
  }

  // Group variants by weight for better display
  const sortedVariants = [...variants].sort((a, b) => {
    const aNum = parseFloat(a.weight.replace(/[^0-9.]/g, ''));
    const bNum = parseFloat(b.weight.replace(/[^0-9.]/g, ''));
    return aNum - bNum;
  });

  const handleVariantSelect = (variantId: string) => {
    const variant = variants.find(v => v.id === variantId);
    if (variant) {
      setCurrentVariant(variant);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Size & Weight</h4>
        <div className="grid grid-cols-2 gap-2">
          {sortedVariants.map((variant) => (
            <motion.div
              key={variant.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={currentVariant.id === variant.id ? "default" : "outline"}
                className={`w-full flex flex-col h-auto p-3 ${
                  currentVariant.id === variant.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400'
                    : 'bg-gray-800/50 border-gray-600 hover:border-emerald-400 hover:bg-gray-700/50'
                }`}
                onClick={() => handleVariantSelect(variant.id)}
              >
                <span className="font-bold text-lg">{variant.weight}</span>
                <span className="text-sm text-emerald-400 font-semibold">
                  ${variant.price}
                </span>
                {variant.stock <= 5 && variant.stock > 0 && (
                  <Badge variant="destructive" className="text-xs mt-1">
                    Only {variant.stock} left
                  </Badge>
                )}
                {variant.stock === 0 && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    Out of Stock
                  </Badge>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile-friendly select dropdown for many variants */}
      {variants.length > 6 && (
        <div className="block md:hidden">
          <Select value={currentVariant.id} onValueChange={handleVariantSelect}>
            <SelectTrigger className="w-full bg-gray-800 border-gray-600">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {sortedVariants.map((variant) => (
                <SelectItem key={variant.id} value={variant.id}>
                  {variant.weight} - ${variant.price}
                  {variant.stock <= 5 && variant.stock > 0 && ' (Low Stock)'}
                  {variant.stock === 0 && ' (Out of Stock)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Price display */}
      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-600">
        <span className="text-gray-300">Selected:</span>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">
            ${currentVariant.price}
          </div>
          <div className="text-sm text-gray-400">
            {currentVariant.weight}
          </div>
        </div>
      </div>
    </div>
  );
}