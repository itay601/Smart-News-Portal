const DashboardHome = () => (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
        {/* Hero Section */}
        <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Welcome to Your Financial Dashboard
            </h1>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl">
                Explore market trends, analyze economic data, and stay informed with real-time insights. 
                Select an option below or from the sidebar to get started.
            </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Agent Analysis Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Agent Analysis</h2>
                <p className="text-gray-600">
                    Dive deep into economic terms, market symbols, and advanced analytics with our AI-powered tools.
                </p>
                <a
                    href="/analysis"
                    className="mt-4 inline-block text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                    Start Analyzing &rarr;
                </a>
            </div>

            {/* Chat Agent Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Chat Agent</h2>
                <p className="text-gray-600">
                    Have a conversation with our AI assistant for insights on markets, trends, and more.
                </p>
                <a
                    href="/chat"
                    className="mt-4 inline-block text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                    Start Chatting &rarr;
                </a>
            </div>

            {/* Placeholder: Stocks Graph Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Stock Trends</h2>
                <p className="text-gray-600">
                    Visualize 5-year stock price trends with interactive charts and customizable options.
                </p>
                <button className="mt-4 text-blue-600 font-medium hover:text-blue-800 transition-colors">
                    View Stocks (Coming Soon)
                </button>
            </div>

            {/* Placeholder: News/Articles Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Economic News</h2>
                <p className="text-gray-600">
                    Stay updated with curated news and articles filtered by economic terms and topics.
                </p>
                <button className="mt-4 text-blue-600 font-medium hover:text-blue-800 transition-colors">
                    Browse News (Coming Soon)
                </button>
            </div>

            {/* Placeholder: Data Center Card (Admin Only) */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Data Center (Admin)</h2>
                <p className="text-gray-600">
                    Monitor tweets, articles, and user content with advanced analytics (admin access required).
                </p>
                <button className="mt-4 text-blue-600 font-medium hover:text-blue-800 transition-colors">
                    Access Data Center (Coming Soon)
                </button>
            </div>
        </div>
    </div>
);

export default DashboardHome;