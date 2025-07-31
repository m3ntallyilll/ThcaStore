import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Tag, 
  Percent, 
  Gift, 
  Sparkles,
  TrendingUp,
  Zap,
  Star,
  ShoppingBag,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DailyPromotion } from '@shared/schema';

const dayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
  'Thursday', 'Friday', 'Saturday'
];

const dayIcons = [
  { icon: Gift, color: 'text-purple-400', bg: 'bg-purple-500/20' }, // Sunday
  { icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/20' },      // Monday
  { icon: Sparkles, color: 'text-yellow-400', bg: 'bg-yellow-500/20' }, // Tuesday
  { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/20' }, // Wednesday
  { icon: Star, color: 'text-orange-400', bg: 'bg-orange-500/20' },     // Thursday
  { icon: ShoppingBag, color: 'text-pink-400', bg: 'bg-pink-500/20' },  // Friday
  { icon: Timer, color: 'text-red-400', bg: 'bg-red-500/20' }           // Saturday
];

const getDiscountIcon = (type: string) => {
  switch (type) {
    case 'percentage':
      return <Percent className="w-4 h-4" />;
    case 'fixed':
      return <Tag className="w-4 h-4" />;
    case 'bogo':
      return <Gift className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
};

const getDiscountColor = (type: string) => {
  switch (type) {
    case 'percentage':
      return 'text-green-400 bg-green-500/20 border-green-500/30';
    case 'fixed':
      return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    case 'bogo':
      return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
    default:
      return 'text-gold bg-gold/20 border-gold/30';
  }
};

export function DailyDeals() {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Fetch today's promotions
  const { data: todaysDeals, isLoading: todayLoading } = useQuery({
    queryKey: ['/api/promotions/today'],
    queryFn: () => apiRequest('/api/promotions/today'),
    refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
  });

  // Fetch all weekly promotions
  const { data: weeklyDeals, isLoading: weeklyLoading } = useQuery({
    queryKey: ['/api/promotions/week'],
    queryFn: () => apiRequest('/api/promotions/week')
  });

  // Fetch selected day promotions
  const { data: selectedDayDeals, isLoading: dayLoading } = useQuery({
    queryKey: ['/api/promotions/day', selectedDay],
    queryFn: () => apiRequest(`/api/promotions/day/${selectedDay}`),
    enabled: selectedDay !== new Date().getDay()
  });

  // Update countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentDeals = selectedDay === new Date().getDay() ? todaysDeals : selectedDayDeals;
  const isToday = selectedDay === new Date().getDay();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="p-3 bg-gradient-to-r from-green-500/20 to-gold/20 rounded-xl border border-green-500/30">
            <Calendar className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white">Daily Cannabis Deals</h1>
        </motion.div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Fresh deals every day of the week! From Sunday Starter Packs to Stoned Saturday blowouts.
        </p>
      </div>

      {/* Today's Special Deal Banner */}
      {isToday && todaysDeals && todaysDeals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden"
        >
          <Card className="bg-gradient-to-r from-green-900/40 via-green-800/40 to-gold/40 border-green-500/50 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Badge className="bg-red-500 text-white px-4 py-2 text-lg font-bold animate-pulse">
                  TODAY ONLY
                </Badge>
                <div className="flex items-center gap-2 text-green-400 font-mono text-xl">
                  <Clock className="w-5 h-5" />
                  {timeLeft}
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2">
                {todaysDeals[0].title}
              </CardTitle>
              <p className="text-gray-200 text-lg">{todaysDeals[0].description}</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className={`p-4 rounded-xl border ${getDiscountColor(todaysDeals[0].discountType)}`}>
                  {getDiscountIcon(todaysDeals[0].discountType)}
                  <div className="mt-2">
                    <div className="text-2xl font-bold">
                      {todaysDeals[0].discountType === 'fixed' ? '$' : ''}
                      {todaysDeals[0].discountValue}
                      {todaysDeals[0].discountType === 'percentage' ? '%' : ''}
                    </div>
                    <div className="text-xs uppercase font-semibold">
                      {todaysDeals[0].discountType === 'bogo' ? 'BOGO' : 'OFF'}
                    </div>
                  </div>
                </div>
                
                {todaysDeals[0].minPurchase && parseFloat(todaysDeals[0].minPurchase) > 0 && (
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Minimum purchase</div>
                    <div className="text-xl font-bold text-white">${todaysDeals[0].minPurchase}</div>
                  </div>
                )}
              </div>
              
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-bold py-3 px-8 text-lg shadow-lg">
                Shop Now & Save!
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Week Selector */}
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day, index) => {
          const DayIcon = dayIcons[index].icon;
          const isSelected = selectedDay === index;
          const isTodayBtn = index === new Date().getDay();
          
          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={isSelected ? "default" : "outline"}
                onClick={() => setSelectedDay(index)}
                className={`w-full h-20 flex flex-col items-center justify-center gap-1 relative ${
                  isSelected 
                    ? `bg-gradient-to-b from-green-500 to-green-600 text-black border-green-400` 
                    : `bg-dark-800 border-dark-600 hover:border-green-500/50 hover:bg-dark-700 text-white`
                }`}
              >
                <DayIcon className={`w-5 h-5 ${isSelected ? 'text-black' : dayIcons[index].color}`} />
                <span className="text-xs font-semibold">{day.slice(0, 3)}</span>
                {isTodayBtn && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Day Deals */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-xl ${dayIcons[selectedDay].bg}`}>
              {React.createElement(dayIcons[selectedDay].icon, {
                className: `w-6 h-6 ${dayIcons[selectedDay].color}`
              })}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {dayNames[selectedDay]} Deals
              {isToday && <span className="text-green-400 ml-2">(Today!)</span>}
            </h2>
          </div>

          {(dayLoading || todayLoading) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-dark-800 animate-pulse rounded-lg" />
              ))}
            </div>
          )}

          {currentDeals && currentDeals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentDeals.map((deal: DailyPromotion, index: number) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-dark-800 border-dark-700 hover:border-green-500/50 transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`${getDiscountColor(deal.discountType)} border`}>
                          {deal.discountType.toUpperCase()}
                        </Badge>
                        {isToday && (
                          <Badge className="bg-red-500 text-white">
                            LIVE NOW
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl text-white">{deal.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {deal.description}
                      </p>
                      
                      <Separator className="bg-dark-600" />
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Discount:</span>
                          <span className="text-green-400 font-bold">
                            {deal.discountType === 'fixed' ? '$' : ''}
                            {deal.discountValue}
                            {deal.discountType === 'percentage' ? '%' : ''}
                            {deal.discountType === 'bogo' ? ' BOGO' : ''}
                          </span>
                        </div>
                        
                        {deal.minPurchase && parseFloat(deal.minPurchase) > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Min. Purchase:</span>
                            <span className="text-white font-semibold">${deal.minPurchase}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Valid:</span>
                          <span className="text-white text-sm">
                            {deal.startTime} - {deal.endTime}
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
                        disabled={!isToday}
                      >
                        {isToday ? 'Shop This Deal' : 'Available ' + dayNames[selectedDay]}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {currentDeals && currentDeals.length === 0 && !dayLoading && !todayLoading && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No deals scheduled</h3>
              <p className="text-gray-500">Check back soon for new promotions!</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}