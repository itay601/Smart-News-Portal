import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Briefcase, Users, Target, TrendingUp, TrendingDown, DollarSign, PieChart, AlertCircle, Info } from 'lucide-react';



const StatCard = ({ icon, title, value, change, colorClass, subText }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
    <div className="flex items-center text-gray-400 mb-2">
      {icon}
      <h3 className="text-md font-semibold ml-2">{title}</h3>
    </div>
    <div>
        <p className={`text-3xl font-bold ${colorClass || 'text-white'}`}>{value}</p>
        {change && <p className={`text-sm font-semibold ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>{change > 0 ? '▲' : '▼'} {change}%</p>}
        {subText && <p className="text-sm text-gray-500 mt-1">{subText}</p>}
    </div>
  </div>
);

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-xl font-bold">An Error Occurred</h2>
            <p className="mt-2 text-gray-400">{message}</p>
        </div>
    </div>
);

// --- Chart Component ---
const RiskDistributionChart = ({ data }) => {
    const chartRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const initializeChart = () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
            const ctx = canvasRef.current.getContext('2d');
            chartRef.current = new window.Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
                    datasets: [{
                        label: 'Risk Distribution',
                        data: [data.low, data.medium, data.high],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(255, 99, 132, 0.7)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#d1d5db',
                                font: { size: 14 }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Investor Risk Distribution',
                            color: '#f9fafb',
                            font: { size: 18 }
                        }
                    }
                }
            });
        };

        if (canvasRef.current && data) {
            if (!window.Chart) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
                script.onload = () => initializeChart();
                document.body.appendChild(script);
            } else {
                initializeChart();
            }
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [data]);

    return <div className="h-80 md:h-96"><canvas ref={canvasRef}></canvas></div>;
};

// --- Main Application Component ---
export default function PortfolioPage() {
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('authToken');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseApiUrl = process.env.REACT_APP_API_URL + "/v1/api/InvestmentAnalysisPortfolio";
                const response = await fetch(baseApiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (!data.astraDocs || data.astraDocs.length === 0) {
                    throw new Error("No portfolio data found for this user.");
                }

                setPortfolioData(data);
                setLoading(false);

            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to format numbers
    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
    const formatPercent = (value) => `${(value || 0).toFixed(2)}%`;
    const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value || 0);
    
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;
    if (!portfolioData) return null;

    const userPortfolio = portfolioData.astraDocs[0];
    const summary = userPortfolio.invest_analysis.summary;
    const holdings = userPortfolio.invest_analysis.portfolio_analysis;
    const stats = portfolioData.stats.aggregate;
    const userPrefs = userPortfolio.user_preferences;

    const totalPnl = summary.total_pnl;
    const totalPnlPct = summary.total_pnl_pct;

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                
                {/* Header */}
                <header className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-blue-400">Investment Portfolio</h1>
                            <p className="text-gray-400">{userPortfolio.user_email}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-semibold text-lg">{userPrefs.strategy} Strategy</p>
                           <span className={`px-3 py-1 text-sm rounded-full ${
                               userPrefs.risk === 'Low' ? 'bg-green-600' :
                               userPrefs.risk === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                           }`}>
                               {userPrefs.risk} Risk
                           </span>
                        </div>
                    </div>
                </header>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard 
                        icon={<TrendingUp className="w-6 h-6"/>} 
                        title="Total Profit / Loss"
                        value={formatCurrency(totalPnl)}
                        change={totalPnlPct.toFixed(2)}
                        colorClass={totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}
                    />
                    <StatCard 
                        icon={<DollarSign className="w-6 h-6"/>} 
                        title="Portfolio Value"
                        value={formatCurrency(summary.total_current_value)}
                        subText={`Invested: ${formatCurrency(summary.total_invested)}`}
                    />
                     <StatCard 
                        icon={<Briefcase className="w-6 h-6"/>} 
                        title="Budget Deployed"
                        value={formatPercent(summary.budget_deployed_pct)}
                        subText={`${formatCurrency(summary.budget_remaining)} remaining`}
                    />
                    <StatCard 
                        icon={<Target className="w-6 h-6"/>} 
                        title="Active Positions"
                        value={holdings.filter(h => h.shares > 0).length}
                        subText={`Total Tickers: ${holdings.length}`}
                    />
                </div>
                
                {/* Budget Progress Bar */}
                 <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
                    <div className="flex justify-between items-center mb-2 text-gray-300">
                        <span className="font-medium">Budget Progress</span>
                        <span className="text-sm">{formatCurrency(summary.total_invested)} / {formatCurrency(summary.budget)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                        <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${summary.budget_deployed_pct}%` }}></div>
                    </div>
                </div>


                {/* Holdings Table & Aggregate Stats */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    
                    {/* Holdings Table */}
                    <div className="xl:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 flex items-center"><BarChart className="mr-3"/>Your Holdings</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-600 text-gray-400">
                                    <tr>
                                        <th className="p-3">Ticker</th>
                                        <th className="p-3 text-right">Shares</th>
                                        <th className="p-3 text-right">Current Price</th>
                                        <th className="p-3 text-right">Value</th>
                                        <th className="p-3 text-right">P/L</th>
                                        <th className="p-3 text-right">P/L %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {holdings.map(h => (
                                        <tr key={h.ticker} className="border-b border-gray-700 hover:bg-gray-700/50">
                                            <td className="p-3 font-bold">{h.ticker}</td>
                                            <td className="p-3 text-right">{h.shares}</td>
                                            <td className="p-3 text-right">{formatCurrency(h.price_now)}</td>
                                            <td className="p-3 text-right">{formatCurrency(h.current_value)}</td>
                                            <td className={`p-3 text-right font-semibold ${h.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {formatCurrency(h.pnl)}
                                            </td>
                                             <td className={`p-3 text-right font-semibold ${h.pnl_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {formatPercent(h.pnl_pct)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Aggregate Stats */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 flex items-center"><Users className="mr-3"/>Platform Stats</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-baseline p-2 border-b border-gray-700">
                                <span className="text-gray-400">Total Users</span>
                                <span className="font-bold text-lg">{formatNumber(stats.total_users)}</span>
                            </div>
                            <div className="flex justify-between items-baseline p-2 border-b border-gray-700">
                                <span className="text-gray-400">Total Invested</span>
                                <span className="font-bold text-lg">{formatCurrency(stats.total_invested)}</span>
                            </div>
                            <div className="flex justify-between items-baseline p-2 border-b border-gray-700">
                                <span className="text-gray-400">Avg. Return</span>
                                <span className={`font-bold text-lg ${stats.avg_return_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {formatPercent(stats.avg_return_pct)}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6">
                           <RiskDistributionChart data={stats.risk_distribution} />
                        </div>
                    </div>
                </div>

                <footer className="text-center text-gray-500 mt-12 text-sm">
                    <p>Portfolio data last updated: {new Date(summary.last_updated).toLocaleString()}</p>
                </footer>
            </div>
        </div>
    );
}
module.export  = {PortfolioPage};