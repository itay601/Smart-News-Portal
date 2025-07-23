import React, { useState } from 'react';

const DataFetchingPage = () => {
    const [activeTab, setActiveTab] = useState('Users');
    const tabs = ['Users', 'Articles', 'API Logs', 'Reports'];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Data Center</h1>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6 px-6">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{activeTab} Data</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">Name</th>
                                    <th className="py-2 px-4 border-b">Status</th>
                                    <th className="py-2 px-4 border-b">Date Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Example Row */}
                                <tr>
                                    <td className="py-2 px-4 border-b text-center">1</td>
                                    <td className="py-2 px-4 border-b text-center">John Doe</td>
                                    <td className="py-2 px-4 border-b text-center"><span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Active</span></td>
                                    <td className="py-2 px-4 border-b text-center">2024-07-21</td>
                                </tr>
                                 <tr>
                                    <td className="py-2 px-4 border-b text-center">2</td>
                                    <td className="py-2 px-4 border-b text-center">Jane Smith</td>
                                    <td className="py-2 px-4 border-b text-center"><span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Pending</span></td>
                                    <td className="py-2 px-4 border-b text-center">2024-07-20</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataFetchingPage;