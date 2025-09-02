import React, { useState } from 'react';
import { Settings, Save, AlertCircle, CheckCircle2, DollarSign, TrendingUp, Shield, Clock } from 'lucide-react';

const UserPreferencesPage = ({ user }) => {
    const [preferences, setPreferences] = useState({
        user_email: user?.email || '',
        query: '',
        budget: 1000,
        risk: 'medium',
        mode: 'virtual',
        strategy: 'long_term',
        stop_loss: 5,
        take_profit: 15,
        max_drawdown: 20,
        leverage: 1.0,
        trade_frequency: 'medium',
        preferred_markets: ['stocks', 'crypto']
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleInputChange = (field, value) => {
        setPreferences(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMarketChange = (market) => {
        setPreferences(prev => ({
            ...prev,
            preferred_markets: prev.preferred_markets.includes(market)
                ? prev.preferred_markets.filter(m => m !== market)
                : [...prev.preferred_markets, market]
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Filter out empty optional fields
            const cleanPreferences = Object.fromEntries(
                Object.entries(preferences).filter(([key, value]) => {
                    if (value === null || value === undefined || value === '') return false;
                    if (Array.isArray(value) && value.length === 0) return false;
                    return true;
                })
            );
            const baseApiUrl = process.env.REACT_APP_API_URL + "/v1/api/userTradingAgents";
            const response = await fetch(baseApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanPreferences)
            });

            if (response.ok) {
                const result = await response.json();
                setSubmitStatus({ type: 'success', message: 'Trading agent preferences saved successfully!' });
                console.log('Success:', result);
                
            } else {
                throw new Error('Failed to save preferences');
            }
        } catch (error) {
            setSubmitStatus({ type: 'error', message: 'Failed to save preferences. Please try again.' });
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center mb-4">
                    <Settings className="w-8 h-8 text-blue-600 mr-3" />
                    <h1 className="text-3xl font-bold text-gray-900">Trading Agent Preferences</h1>
                </div>
                <p className="text-gray-600">Configure your trading agent to match your investment strategy and risk tolerance.</p>
            </div>

            {/* Status Message */}
            {submitStatus && (
                <div className={`mb-6 p-4 rounded-lg flex items-center ${
                    submitStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                    {submitStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
                    {submitStatus.message}
                </div>
            )}

            <div className="space-y-8">
                {/* Basic Configuration */}
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                        Basic Configuration
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trading Query/Description
                            </label>
                            <textarea
                                value={preferences.query}
                                onChange={(e) => handleInputChange('query', e.target.value)}
                                placeholder="Describe your trading goals and preferences..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget ($)
                            </label>
                            <input
                                type="number"
                                value={preferences.budget}
                                onChange={(e) => handleInputChange('budget', parseFloat(e.target.value))}
                                min="100"
                                step="100"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trading Mode
                            </label>
                            <select
                                value={preferences.mode}
                                onChange={(e) => handleInputChange('mode', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="virtual">Virtual Trading</option>
                                <option value="live">Live Trading</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Leverage
                            </label>
                            <input
                                type="number"
                                value={preferences.leverage}
                                onChange={(e) => handleInputChange('leverage', parseFloat(e.target.value))}
                                min="1.0"
                                max="10.0"
                                step="0.1"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Risk Management */}
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-red-600" />
                        Risk Management
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Risk Level
                            </label>
                            <select
                                value={preferences.risk}
                                onChange={(e) => handleInputChange('risk', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="low">Low Risk</option>
                                <option value="medium">Medium Risk</option>
                                <option value="high">High Risk</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stop Loss (%)
                            </label>
                            <input
                                type="number"
                                value={preferences.stop_loss}
                                onChange={(e) => handleInputChange('stop_loss', parseFloat(e.target.value))}
                                min="0"
                                max="100"
                                step="0.5"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Take Profit (%)
                            </label>
                            <input
                                type="number"
                                value={preferences.take_profit}
                                onChange={(e) => handleInputChange('take_profit', parseFloat(e.target.value))}
                                min="0"
                                max="100"
                                step="0.5"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Drawdown (%)
                            </label>
                            <input
                                type="number"
                                value={preferences.max_drawdown}
                                onChange={(e) => handleInputChange('max_drawdown', parseFloat(e.target.value))}
                                min="0"
                                max="100"
                                step="1"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Trading Strategy */}
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                        Trading Strategy
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Strategy Type
                            </label>
                            <select
                                value={preferences.strategy}
                                onChange={(e) => handleInputChange('strategy', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="day_trading">Day Trading</option>
                                <option value="swing">Swing Trading</option>
                                <option value="long_term">Long Term</option>
                                <option value="scalping">Scalping</option>
                                <option value="momentum">Momentum</option>
                                <option value="mean_reversion">Mean Reversion</option>
                                <option value="algorithmic">Algorithmic</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Trade Frequency
                            </label>
                            <select
                                value={preferences.trade_frequency}
                                onChange={(e) => handleInputChange('trade_frequency', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="low">Low Frequency</option>
                                <option value="medium">Medium Frequency</option>
                                <option value="high">High Frequency</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Preferred Markets */}
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Preferred Markets
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['stocks', 'crypto', 'forex', 'etf'].map((market) => (
                            <label key={market} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    checked={preferences.preferred_markets.includes(market)}
                                    onChange={() => handleMarketChange(market)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                                    {market}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-8 py-3 rounded-lg font-medium flex items-center ${
                            isSubmitting
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                        } transition-colors duration-200`}
                    >
                        <Save className="w-5 h-5 mr-2" />
                        {isSubmitting ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserPreferencesPage;