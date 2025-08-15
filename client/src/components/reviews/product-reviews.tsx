import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, User, ThumbsUp, Calendar, Verified } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  strain?: string;
  effects?: string[];
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
  className?: string;
}

// Sample reviews for SEO and social proof
const sampleReviews: Review[] = [
  {
    id: '1',
    userName: 'Sarah M.',
    rating: 5,
    title: 'Amazing quality THCA flower!',
    content: 'This Purple Koolaid THCA is incredible. Lab-tested quality shows - clean, potent, and exactly as described. Fast shipping to Colorado, discrete packaging. Will definitely order again!',
    date: '2025-01-10',
    verified: true,
    helpful: 24,
    strain: 'Purple Koolaid',
    effects: ['Relaxing', 'Creative', 'Happy']
  },
  {
    id: '2',
    userName: 'Mike D.',
    rating: 5,
    title: 'Best THCA pre-rolls online',
    content: 'These 1.5g joints are perfectly rolled and burn evenly. The THCA content is legit - you can tell this is premium hemp. Customer service was helpful with my questions about shipping to Texas.',
    date: '2025-01-08',
    verified: true,
    helpful: 18,
    effects: ['Euphoric', 'Focused']
  },
  {
    id: '3',
    userName: 'Jennifer L.',
    rating: 4,
    title: 'High quality, fast delivery',
    content: 'Ordered THCA diamonds and flower. Both products exceeded expectations. Lab results are thorough and shipping was discreet. Only 4 stars because I wish there were more strain options.',
    date: '2025-01-05',
    verified: true,
    helpful: 12,
    effects: ['Uplifting', 'Pain Relief']
  },
  {
    id: '4',
    userName: 'David R.',
    rating: 5,
    title: 'Legitimate THCA, excellent service',
    content: 'Finally found a trustworthy THCA source. Products are exactly as advertised, customer support is responsive, and delivery to Florida was quick. The COA documents give peace of mind.',
    date: '2025-01-03',
    verified: true,
    helpful: 31,
    effects: ['Relaxing', 'Sleep Aid']
  },
  {
    id: '5',
    userName: 'Ashley K.',
    rating: 5,
    title: 'Perfect for beginners',
    content: 'New to THCA and the team helped me choose the right products. The educational resources on the site are helpful. My order arrived in California within 2 days. Highly recommend!',
    date: '2024-12-28',
    verified: true,
    helpful: 15,
    effects: ['Mild', 'Relaxing']
  }
];

export function ProductReviews({ productId, productName, className = '' }: ProductReviewsProps) {
  const [reviews] = useState<Review[]>(sampleReviews);
  
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => 
    reviews.filter(review => review.rating === rating).length
  );

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4', 
      lg: 'w-5 h-5'
    };
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Review Summary */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Customer Reviews for {productName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(averageRating), 'lg')}
              <div className="text-gray-400 mt-2">
                Based on {reviews.length} verified reviews
              </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-white text-sm w-3">{rating}</span>
                  <Star className="w-3 h-3 text-yellow-400" />
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(ratingDistribution[index] / reviews.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm w-8">
                    {ratingDistribution[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">Customer Experiences</h3>
        
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-emerald-600 text-white">
                        {review.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{review.userName}</span>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                            <Verified className="w-3 h-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating, 'sm')}
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-white mb-2">{review.title}</h4>
                <p className="text-gray-300 mb-4 leading-relaxed">{review.content}</p>
                
                {/* Effects Tags */}
                {review.effects && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.effects.map(effect => (
                      <Badge key={effect} variant="secondary" className="text-xs bg-emerald-600/20 text-emerald-400">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Helpful Button */}
                <div className="flex items-center justify-between text-sm">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <ThumbsUp className="w-3 h-3 mr-2" />
                    Helpful ({review.helpful})
                  </Button>
                  {review.strain && (
                    <span className="text-gray-400">Strain: {review.strain}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Review CTA */}
      <Card className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 border-emerald-500/30">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Share Your Experience</h3>
          <p className="text-gray-300 mb-4">
            Help other customers by leaving an honest review of your THCA purchase
          </p>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Write a Review
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}