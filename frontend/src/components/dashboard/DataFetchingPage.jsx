import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, Eye, ExternalLink, Loader, AlertCircle } from 'lucide-react';


const DataFetchingPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [economicTerm, setEconomicTerm] = useState('inflation');
    const [expandedArticle, setExpandedArticle] = useState(null);

    // Predefined economic terms for quick selection
    const popularTerms = [
        'inflation', 'recession', 'gdp', 'unemployment', 'interest rates',
        'stock market', 'bitcoin', 'federal reserve', 'trade war', 'economic growth'
    ];

    const fetchArticles = useCallback(async (term) => {
        if (!term.trim()) return;
        setLoading(true);
        setError('');
        
        try {
            // Construct query URL with URLSearchParams for cleaner parameter handling
            const url = `/v1/api/dataagent?dataagent&economic_term=${term}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Handle different possible response structures
            const articlesData = Array.isArray(data) ? data : (data.articles || data.data || []);
            setArticles(articlesData.slice(0, 20)); // Limit to 20 articles

        } catch (err) {
            setError(`Failed to fetch articles: ${err.message}`);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []); 

    useEffect(() => {
        fetchArticles(economicTerm);
    }, [fetchArticles]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        fetchArticles(economicTerm);
    };

    const toggleExpanded = (articleId) => {
        setExpandedArticle(expandedArticle === articleId ? null : articleId);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const truncateText = (text, maxLength = 150) => {
        if (!text) return 'No description available';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Economic Articles Explorer</h1>
                    <p className="text-gray-600 text-lg">Discover insights from the world of economics</p>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={economicTerm}
                                onChange={(e) => setEconomicTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                                placeholder="Enter economic term (e.g., inflation, recession, GDP)"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            {loading ? 'Searching...' : 'Search Articles'}
                        </button>
                    </div>

                    {/* Popular Terms */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-600 mr-2">Popular terms:</span>
                        {popularTerms.map((term) => (
                            <button
                                key={term}
                                onClick={() => {
                                    setEconomicTerm(term);
                                    fetchArticles(term);
                                }}
                                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Info */}
                {articles.length > 0 && (
                    <div className="text-center mb-6">
                        <p className="text-gray-600">
                            Found <span className="font-semibold text-blue-600">{articles.length}</span> articles for 
                            <span className="font-semibold text-blue-600"> "{economicTerm}"</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Error State */}
            {error && (
                <div className="max-w-7xl mx-auto mb-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                                <div className="h-4 bg-gray-300 rounded m-4"></div>
                                <div className="h-3 bg-gray-200 rounded mx-4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded mx-4 mb-4"></div>
                                <div className="h-16 bg-gray-100 m-4 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Articles Grid */}
            {!loading && articles.length > 0 && (
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {articles.map((article, index) => {
                            const articleId = article.id || index;
                            return (
                                <div
                                    key={articleId}
                                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
                                >
                                    {/* Article Header */}
                                    <div className="p-5 border-b border-gray-100">
                                        <h3 className="font-bold text-gray-800 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {article.title || article.headline || `Article ${index + 1}`}
                                        </h3>
                                        
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(article.createdAt || article.date || article.publishedAt)}
                                            </div>
                                            {article.source_name && (
                                                <div className="truncate">
                                                    {article.source_name}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Article Content */}
                                    <div className="p-5">
                                        {expandedArticle === articleId ? (
                                            <div className="text-gray-600 text-sm leading-relaxed mb-4">
                                                {article.urlToImage && (
                                                    <img
                                                        src={article.urlToImage}
                                                        alt={article.title}
                                                        className="w-full rounded mb-4"
                                                    />
                                                )}
                                                {article.author && (
                                                    <p>
                                                        <strong>Author:</strong> {article.author}
                                                    </p>
                                                )}
                                                {article.source_name && (
                                                    <p>
                                                        <strong>Source:</strong> {article.source_name}
                                                    </p>
                                                )}
                                                {article.description && (
                                                    <p>
                                                        <strong>Description:</strong> {article.description}
                                                    </p>
                                                )}
                                                {article.content && (
                                                    <p>
                                                        <strong>Content:</strong> {article.content}
                                                    </p>
                                                )}
                                                {article.economic_terms && (
                                                    <p>
                                                        <strong>Economic Terms:</strong> {article.economic_terms}
                                                    </p>
                                                )}
                                                <p>
                                                    <strong>Published Date:</strong> {formatDate(article.createdAt)}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                                {truncateText(article.content || article.description || article.summary)}
                                            </p>
                                        )}

                                        {/* Article Actions */}
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => toggleExpanded(articleId)}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                {expandedArticle === articleId ? 'Show Less' : 'Read More'}
                                            </button>

                                            {article.url && (
                                                <a
                                                    href={article.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    Source
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Article Footer */}
                                    {(article.tags || article.category) && (
                                        <div className="px-5 pb-4">
                                            <div className="flex flex-wrap gap-1">
                                                {article.category && (
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                        {article.category}
                                                    </span>
                                                )}
                                                {article.tags && Array.isArray(article.tags) && article.tags.slice(0, 2).map((tag, i) => (
                                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* No Results State */}
            {!loading && !error && articles.length === 0 && economicTerm && (
                <div className="max-w-7xl mx-auto text-center py-12">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Articles Found</h3>
                        <p className="text-gray-500 mb-6">
                            No articles were found for "{economicTerm}". Try searching for a different economic term.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {popularTerms.slice(0, 5).map((term) => (
                                <button
                                    key={term}
                                    onClick={() => {
                                        setEconomicTerm(term);
                                        fetchArticles(term);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Try "{term}"
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataFetchingPage;