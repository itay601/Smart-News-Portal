import { useState, useEffect } from 'react';

const DataCenter = () => {
    const [activeTab, setActiveTab] = useState('Users');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchUsername, setSearchUsername] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    
    const tabs = ['Users', 'Articles', 'Tweets', 'Current User', 'Search User', 'Search User (Admin)']; 
    const API_BASE_URL = process.env.REACT_APP_API_URL;
    
    // Get JWT token from localStorage or state management
    const token = localStorage.getItem('authToken');
    
    // Map tabs to their GraphQL queries and configurations
    const graphqlConfig = {
        'Users': {
            query: `
                query GetAllUsers { 
                    getAllUsers { 
                        username 
                        email 
                        role 
                    } 
                }
            `,
            key: 'getAllUsers',
            requiresVariables: false,
        },
        'Articles': {
            query: `
                query GetArticles {
                    articles {
                        source_name 
                        author 
                        title 
                        description 
                        url 
                        content 
                        economic_terms 
                        createdAt
                    }
                }
            `,
            key: 'articles',
            requiresVariables: false,
        },
        'Tweets': {
            query: `
                query GetTweets {
                    tweets {
                        tweet_id
                        author_id
                        created_at
                        retweet_count
                        reply_count
                        like_count
                        quote_count
                        lang
                    }
                }
            `,
            key: 'tweets',
            requiresVariables: false,
        },
        'Current User': {
            query: `
                query GetMe {
                    me {
                        username
                        email
                        role
                    }
                }
            `,
            key: 'me',
            requiresVariables: false,
        },
        'Search User': {
            query: `
                query GetUser($username: String!) {
                    getUserByUsername(username: $username) {
                        username
                        email
                        role
                    }
                }
            `,
            key: 'getUserByUsername',
            requiresVariables: true,
            variableKey: 'username',
        },
        'Search User (Admin)': {
            query: `
                query GetUserWithPasswords($username: String!) {
                    getUserWithPasswords(username: $username) {
                        username
                        email
                        role
                        passwordTemp
                        passwordSecond
                        passwordThird
                    }
                }
            `,
            key: 'getUserWithPasswords',
            requiresVariables: true,
            variableKey: 'username',
        },
    };

    const fetchData = async (tabName = activeTab, username = searchUsername) => {
        setLoading(true);
        setError(null);
        setData([]);

        const config = graphqlConfig[tabName];

        if (!config) {
            setError('Invalid tab selected');
            setLoading(false);
            return;
        }

        // Check if this query requires variables and we don't have them
        if (config.requiresVariables && !username.trim()) {
            setError('Please enter a username to search');
            setLoading(false);
            return;
        }

        try {
            const requestBody = {
                query: config.query,
            };

            // Add variables if required
            if (config.requiresVariables && username.trim()) {
                requestBody.variables = {
                    [config.variableKey]: username.trim()
                };
            }

            const response = await fetch(`${API_BASE_URL}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.errors) {
                throw new Error(result.errors.map(err => err.message).join(', '));
            }
            
            // Handle the response data
            const responseData = result.data[config.key];
            
            // If it's a single object, wrap it in an array for consistent table rendering
            if (responseData && !Array.isArray(responseData)) {
                setData([responseData]);
            } else if (responseData) {
                setData(responseData);
            } else {
                setData([]);
            }

        } catch (e) {
            console.error("Failed to fetch data:", e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Don't auto-fetch for search tabs
        if (!graphqlConfig[activeTab]?.requiresVariables) {
            fetchData(activeTab);
        } else {
            setData([]);
            setError(null);
        }
    }, [activeTab]);

    const handleSearch = () => {
        if (graphqlConfig[activeTab]?.requiresVariables) {
            fetchData(activeTab, searchUsername);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const renderSearchInput = () => {
        if (!graphqlConfig[activeTab]?.requiresVariables) {
            return null;
        }

        return (
            <div className="mb-4 flex gap-2 items-center">
                <input
                    type="text"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter username to search..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    disabled={!searchUsername.trim() || loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Search
                </button>
            </div>
        );
    };

    const formatCellValue = (value) => {
        if (value === null || value === undefined) {
            return '-';
        }
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        if (typeof value === 'string' && value.length > 100) {
            return value.substring(0, 100) + '...';
        }
        return String(value);
    };

    const renderTable = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading...</span>
                </div>
            );
        }
        
        if (error) {
            return (
                <div className="text-center py-8">
                    <p className="text-red-500 mb-2">Error: {error}</p>
                    {graphqlConfig[activeTab]?.requiresVariables && (
                        <p className="text-gray-600 text-sm">Make sure to enter a username and try again.</p>
                    )}
                </div>
            );
        }
        
        if (!data || data.length === 0) {
            return (
                <div className="text-center py-8">
                    <p className="text-gray-600">
                        {graphqlConfig[activeTab]?.requiresVariables 
                            ? `Enter a username above to search for ${activeTab.toLowerCase()} data.`
                            : `No data available for ${activeTab}.`
                        }
                    </p>
                </div>
            );
        }

        const headers = Object.keys(data[0]);

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            {headers.map(header => (
                                <th key={header} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    {header.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                {headers.map(header => (
                                    <td key={`${index}-${header}`} className="py-3 px-4 text-sm text-gray-900 border-b">
                                        <div className="max-w-xs truncate" title={formatCellValue(item[header])}>
                                            {formatCellValue(item[header])}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Center</h1>
                <p className="text-gray-600">Manage and view your application data</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="flex overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab
                                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab}
                                {graphqlConfig[tab]?.requiresVariables && (
                                    <span className="ml-1 text-xs text-gray-400">🔍</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">{activeTab} Data</h3>
                        {!graphqlConfig[activeTab]?.requiresVariables && (
                            <button
                                onClick={() => fetchData()}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                            >
                                Refresh
                            </button>
                        )}
                    </div>

                    {/* Search Input for variable-requiring queries */}
                    {renderSearchInput()}

                    {/* Data Table */}
                    {renderTable()}
                </div>
            </div>
        </div>
    );
};

export default DataCenter;