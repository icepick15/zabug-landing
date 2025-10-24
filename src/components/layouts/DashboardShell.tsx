import React from 'react';

const DashboardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col h-screen">
            <header className="bg-gray-800 text-white p-4">
                <h1 className="text-xl">Dashboard</h1>
            </header>
            <div className="flex flex-1">
                <aside className="w-64 bg-gray-200 p-4">
                    <nav>
                        <ul>
                            <li className="mb-2"><a href="/dashboard" className="text-gray-700">Home</a></li>
                            <li className="mb-2"><a href="/dashboard/referrals" className="text-gray-700">Referrals</a></li>
                            <li className="mb-2"><a href="/dashboard/stats" className="text-gray-700">Statistics</a></li>
                            <li className="mb-2"><a href="/dashboard/settings" className="text-gray-700">Settings</a></li>
                        </ul>
                    </nav>
                </aside>
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardShell;