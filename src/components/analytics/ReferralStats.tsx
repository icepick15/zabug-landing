import React from 'react';

const ReferralStats: React.FC<{ totalSales: number; commissionsEarned: number }> = ({ totalSales, commissionsEarned }) => {
    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Referral Statistics</h2>
            <div className="flex justify-between">
                <div>
                    <h3 className="text-lg">Total Sales</h3>
                    <p className="text-2xl font-bold">{totalSales}</p>
                </div>
                <div>
                    <h3 className="text-lg">Commissions Earned</h3>
                    <p className="text-2xl font-bold">{commissionsEarned}</p>
                </div>
            </div>
        </div>
    );
};

export default ReferralStats;