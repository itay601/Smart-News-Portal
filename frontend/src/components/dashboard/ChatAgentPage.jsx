

const ChatAgentPage = () => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Chat Agent</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm h-[60vh] flex flex-col">
            <div className="flex-grow overflow-y-auto mb-4 border-b pb-4">
                {/* Chat messages would go here */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">A</div>
                    <div className="bg-gray-100 p-3 rounded-lg max-w-lg">
                        <p className="text-sm text-gray-800">Hello! I am your economic assistant. How can I help you today?</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3 mb-4 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">U</div>
                    <div className="bg-purple-100 p-3 rounded-lg max-w-lg">
                        <p className="text-sm text-gray-800">Can you explain "quantitative easing"?</p>
                    </div>
                </div>
            </div>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full pl-4 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal"><path d="m3 3 3 9-3 9 19-9Z"/><path d="M6 12h16"/></svg>
                </button>
            </div>
        </div>
    </div>
);

export default ChatAgentPage;