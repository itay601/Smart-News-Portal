
const AgentAnalysisPage = () => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Agent Analysis</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">Stock Symbol (Optional)</label>
                    <input type="text" id="symbol" className="w-full p-2 border rounded-md" placeholder="e.g., AAPL, GOOGL" />
                </div>
                <div>
                    <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">Economic Term (Required)</label>
                    <input type="text" id="term" className="w-full p-2 border rounded-md" placeholder="e.g., Inflation, GDP" />
                </div>
            </div>
            <div className="mt-6">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                    Analyze
                </button>
            </div>
        </div>
        <div className="mt-8 bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <p className="text-gray-500">Results will be displayed here...</p>
        </div>
    </div>
);

export default AgentAnalysisPage;