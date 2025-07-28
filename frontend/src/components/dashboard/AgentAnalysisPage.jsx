import { useState } from 'react';

// Component to format and display the analysis response beautifully
const FormattedResponse = ({ content }) => {
    const formatContent = (text) => {
        // Split by double line breaks to get paragraphs
        const sections = text.split('\n\n');
        
        return sections.map((section, index) => {
            // Handle main headings (text between ** **)
            if (section.includes('**') && !section.includes('*   ')) {
                const parts = section.split(/(\*\*[^*]+\*\*)/);
                return (
                    <div key={index} className="mb-6">
                        {parts.map((part, partIndex) => {
                            if (part.match(/^\*\*[^*]+\*\*$/)) {
                                // Main heading
                                const text = part.replace(/\*\*/g, '');
                                return (
                                    <h3 key={partIndex} className="text-xl font-bold text-blue-800 mb-3 border-l-4 border-blue-500 pl-4">
                                        {text}
                                    </h3>
                                );
                            } else if (part.trim()) {
                                // Regular text with inline formatting
                                return (
                                    <p key={partIndex} className="text-gray-700 leading-relaxed mb-3">
                                        {formatInlineText(part)}
                                    </p>
                                );
                            }
                            return null;
                        })}
                    </div>
                );
            }
            
            // Handle bullet point lists
            if (section.includes('*   ')) {
                const lines = section.split('\n');
                const heading = lines[0];
                const items = lines.slice(1).filter(line => line.trim().startsWith('*'));
                
                return (
                    <div key={index} className="mb-6">
                        {heading && (
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                {formatInlineText(heading)}
                            </h4>
                        )}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-l-4 border-blue-400">
                            <ul className="space-y-4">
                                {items.map((item, itemIndex) => {
                                    const cleanItem = item.replace(/^\*\s+/, '');
                                    const [title, ...description] = cleanItem.split(':');
                                    
                                    return (
                                        <li key={itemIndex} className="flex items-start">
                                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4"></div>
                                            <div className="flex-1">
                                                {description.length > 0 ? (
                                                    <>
                                                        <span className="font-semibold text-blue-800">
                                                            {formatInlineText(title)}:
                                                        </span>
                                                        <span className="text-gray-700 ml-1">
                                                            {formatInlineText(description.join(':'))}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-700">
                                                        {formatInlineText(cleanItem)}
                                                    </span>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                );
            }
            
            // Handle regular paragraphs
            if (section.trim()) {
                return (
                    <div key={index} className="mb-6">
                        <p className="text-gray-700 leading-relaxed text-base">
                            {formatInlineText(section)}
                        </p>
                    </div>
                );
            }
            
            return null;
        }).filter(Boolean);
    };
    
    const formatInlineText = (text) => {
        // Handle bold text (**text**)
        const parts = text.split(/(\*\*[^*]+\*\*)/);
        return parts.map((part, index) => {
            if (part.match(/^\*\*[^*]+\*\*$/)) {
                return (
                    <strong key={index} className="font-bold text-gray-900 bg-yellow-100 px-1 rounded">
                        {part.replace(/\*\*/g, '')}
                    </strong>
                );
            }
            return part;
        });
    };
    
    return (
        <div className="max-w-none">
            <div className="bg-white">
                {formatContent(content)}
            </div>
        </div>
    );
};

const AgentAnalysisPage = () => {
    const [symbol, setSymbol] = useState('');
    const [term, setTerm] = useState('');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        if (!term.trim()) {
            setError('Economic term is required');
            return;
        }

        if (!query.trim()) {
            setError('Query message is required');
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch(`/v1/api/gemenaiAgentAnalysis`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: query.trim(),
                    economic_term: term.trim(),
                    symbol: symbol.trim() || undefined
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(`Analysis failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAnalyze();
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Agent Analysis</h1>
            <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Symbol (Optional)
                        </label>
                        <input 
                            type="text" 
                            id="symbol" 
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder="e.g., AAPL, GOOGL, IBM" 
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <div>
                        <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
                            Economic Term (Required)
                        </label>
                        <input 
                            type="text" 
                            id="term" 
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder="e.g., Inflation, GDP, Interest rates" 
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                </div>
                
                <div className="mb-6">
                    <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
                        Analysis Query (Required)
                    </label>
                    <textarea 
                        id="query" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y" 
                        placeholder="e.g., How will inflation affect IBM's future performance? What are the growth prospects?"
                        onKeyPress={handleKeyPress}
                    />
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <div>
                    <button 
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        )}
                        {loading ? 'Analyzing...' : 'Analyze'}
                    </button>
                </div>
            </div>

            <div className="mt-8 bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                        <span className="ml-3 text-gray-600">Analyzing your query...</span>
                    </div>
                ) : results ? (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-800 mb-2">Query Summary</h3>
                            <p className="text-sm text-gray-600 mb-1"><strong>Query:</strong> {query}</p>
                            <p className="text-sm text-gray-600 mb-1"><strong>Economic Term:</strong> {term}</p>
                            {symbol && <p className="text-sm text-gray-600"><strong>Symbol:</strong> {symbol}</p>}
                        </div>
                        
                        <div className="formatted-response">
                            {typeof results === 'string' ? (
                                <FormattedResponse content={results} />
                            ) : results.response ? (
                                <FormattedResponse content={results.response} />
                            ) : (
                                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                                    {JSON.stringify(results, null, 2)}
                                </pre>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Enter your analysis parameters above and click "Analyze" to get results...</p>
                )}
            </div>
        </div>
    );
};

export default AgentAnalysisPage;