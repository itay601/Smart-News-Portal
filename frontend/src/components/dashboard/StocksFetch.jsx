
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const stocks = [
    "AAPL", "TSLA", "AMZN", "MSFT", "NVDA", "GOOGL", "META", "NFLX", "JPM", "V",
    "BAC", "AMD", "PYPL", "DIS", "T", "PFE", "COST", "INTC", "KO", "TGT", "NKE",
    "SPY", "BA", "BABA", "XOM", "WMT", "GE", "CSCO", "VZ", "JNJ", "CVX", "PLTR",
    "SQ", "SHOP", "SBUX", "SOFI", "HOOD", "RBLX", "SNAP", "AMD", "UBER", "FDX",
    "ABBV", "ETSY", "MRNA", "LMT", "GM", "F", "RIVN", "LCID", "CCL", "DAL", "UAL",
    "AAL", "TSM", "SONY", "ET", "NOK", "MRO", "COIN", "RIVN", "SIRI", "SOFI",
    "RIOT", "CPRX", "PYPL", "TGT", "VWO", "SPYG", "NOK", "ROKU", "HOOD", "VIAC",
    "ATVI", "BIDU", "DOCU", "ZM", "PINS", "TLRY", "WBA", "VIAC", "MGM", "NFLX",
    "NIO", "C", "GS", "WFC", "ADBE", "PEP", "UNH", "CARR", "FUBO", "HCA", "TWTR",
    "BILI", "SIRI", "VIAC", "FUBO", "RKT"
];


const StocksFetch = () => {
    // State for the stock symbol input
    const [symbol, setSymbol] = useState('AAPL');
    // State to hold the fetched stock data
    const [stockData, setStockData] = useState([]);
    // State to manage loading status
    const [loading, setLoading] = useState(false);
    // State for any potential errors during fetch
    const [error, setError] = useState(null);
    // State to hold the symbol that is currently being displayed
    const [activeSymbol, setActiveSymbol] = useState('');

    // Function to fetch stock data from the GraphQL API
    const fetchStockData = async (fetchSymbol) => {
        if (!fetchSymbol) {
            setError('Please enter a stock symbol.');
            return;
        }
        setLoading(true);
        setError(null);

        // GraphQL query structure
        const query = `
            query ($symbol: String!) {
                specificStockPrices(symbol: $symbol) {
                    symbol
                    date
                    open
                    high
                    low
                    close
                    volume
                }
            }
        `;

        const variables = {
            symbol: fetchSymbol.toUpperCase()
        };

        try {
            const baseApiUrl = process.env.REACT_APP_API_URL;
            const apiUrl = baseApiUrl + "/graphql";
            // Making the POST request to the GraphQL endpoint
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
            });

            const result = await response.json();

            // Handling GraphQL errors or empty data
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }
            
            if (!result.data.specificStockPrices || result.data.specificStockPrices.length === 0) {
                throw new Error(`No data found for symbol "${fetchSymbol}". Please check the symbol and try again.`);
            }

            // Formatting data for the chart
            const formattedData = result.data.specificStockPrices.map(item => ({
                ...item,
                date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                close: parseFloat(item.close) // Ensure 'close' is a number
            })).reverse(); // Reverse to show chronological order

            setStockData(formattedData);
            setActiveSymbol(fetchSymbol.toUpperCase());

        } catch (err) {
            console.error("Error fetching stock data:", err);
            setError(err.message);
            setStockData([]); // Clear data on error
            setActiveSymbol('');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data for the default symbol when the component mounts
    useEffect(() => {
        fetchStockData('AAPL');
    }, []);

    // Handler for the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchStockData(symbol);
    };

    // Custom Tooltip for the chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="label font-bold text-gray-800">{`${label}`}</p>
                    <p className="intro text-blue-600">{`Close: $${payload[0].value.toFixed(2)}`}</p>
                    <p className="text-gray-600">{`Volume: ${payload[0].payload.volume.toLocaleString()}`}</p>
                </div>
            );
        }
        return null;
    };


    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Stock Market Dashboard</h1>
                <p className="text-gray-500 mt-1">Enter a stock symbol to view its historical price data.</p>
            </header>

            {/* Input form for stock symbol */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        placeholder="e.g., AAPL, GOOGL"
                        className="w-full sm:w-auto flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Fetching...' : 'Get Data'}
                    </button>
                </form>
            </div>

            {/* Chart display area */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                {error && (
                     <div className="text-center p-8 bg-red-50 text-red-600 rounded-lg">
                        <h3 className="text-xl font-semibold">An Error Occurred</h3>
                        <p>{error}</p>
                    </div>
                )}
                
                {!error && (
                    loading ? (
                        <div className="flex items-center justify-center h-96">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : stockData.length > 0 ? (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">
                                {activeSymbol} Price Chart
                            </h2>
                             <p className="text-gray-500 mb-6">Showing closing prices for the last period.</p>
                            <div style={{ width: '100%', height: 400 }}>
                               <ResponsiveContainer>
                                    <LineChart
                                        data={stockData}
                                        margin={{
                                            top: 5, right: 30, left: 20, bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="date" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" domain={['dataMin - 5', 'dataMax + 5']} tickFormatter={(value) => `$${value.toFixed(2)}`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} dot={{r: 2}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : !activeSymbol && (
                         <div className="text-center p-8 text-gray-500">
                            <h3 className="text-xl font-semibold">No Data to Display</h3>
                            <p>Enter a symbol above to get started.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default StocksFetch;