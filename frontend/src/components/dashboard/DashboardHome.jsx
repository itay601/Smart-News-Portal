const DashboardHome = () => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to your Dashboard</h1>
        <p className="text-gray-600">
            Select an option from the sidebar to get started. You can chat with our AI agent,
            perform detailed analysis, or manage your data.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-2">Agent Analysis</h2>
                <p className="text-gray-600">Dive deep into economic terms and market symbols.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-2">Chat Agent</h2>
                <p className="text-gray-600">Have a conversation with our knowledgeable AI assistant.</p>
            </div>
        </div>
    </div>
);

export default DashboardHome;