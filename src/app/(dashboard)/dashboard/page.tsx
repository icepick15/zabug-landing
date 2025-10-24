import React from 'react';
import ReferralStats from '@/components/analytics/ReferralStats';

const DashboardPage = () => {
  // TODO: Fetch actual referral data from API
  const totalSales = 0;
  const commissionsEarned = 0;

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ReferralStats totalSales={totalSales} commissionsEarned={commissionsEarned} />
    </div>
  );
};

export default DashboardPage;
