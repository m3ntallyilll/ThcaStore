import { Helmet } from 'react-helmet-async';
import { DailyDeals } from '@/components/promotions/daily-deals';

export function DailyDealsPage() {
  return (
    <div className="min-h-screen bg-dark-950 pt-20">
      <Helmet>
        <title>Daily THCA Deals - Save Up to 50% | Mentally-Chill</title>
        <meta name="description" content="Exclusive daily THCA deals & flash sales. Save up to 50% on premium lab-tested THCA products. Limited-time offers on flower, pre-rolls & concentrates." />
        <meta name="keywords" content="THCA deals, daily cannabis deals, THCA sale, cheap THCA products, THCA discounts, hemp deals, flash sale THCA" />
        <meta property="og:title" content="Daily THCA Deals - Save Up to 50%" />
        <meta property="og:description" content="Exclusive daily THCA deals & flash sales. Save big on premium lab-tested products." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mentally-chill.online/daily-deals" />

      </Helmet>
      <DailyDeals />
    </div>
  );
}