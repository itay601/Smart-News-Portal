import React, { useState } from 'react';
import { 
    BarChart2, 
    MessageSquare, 
    Database, 
    //User, 
    Settings, 
    LogOut, 
    ChevronLeft, 
    ChevronRight, 
    Menu, 
    //X,
    Search,
    Bell
    
} from 'lucide-react';

import Sidebar from './dashboard/SideBar';
import Header from './dashboard/Header';
import DashboardHome from './dashboard/DashboardHome';
import ChatAgentPage from './dashboard/ChatAgentPage';
import AgentAnalysisPage from './dashboard/AgentAnalysisPage';
import DataFetchingPage from './dashboard/DataFetchingPage';
import StocksFetch from './dashboard/StocksFetch';
import SignInPage from './authPages/SignInPage';
import DataCenter from './dashboard/DataCenter';


const Dashboard = () => {
    const [activePage, setActivePage] = useState('Dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSignIn = () => setIsLoggedIn(true);
    const handleSignOut = () => setIsLoggedIn(false);

    const renderPage = () => {
        switch (activePage) {
            case 'Dashboard':
                return <DashboardHome />;
            case 'Chat Agent':
                return <ChatAgentPage />;
            case 'Agent Analysis':
                return <AgentAnalysisPage />;
            case 'Data Fetching':
                return <DataFetchingPage />;
            case 'Stocks Fetching':
                return <StocksFetch />;
            case 'Data Center':
                return <DataCenter />;    
            default:
                return <DashboardHome />;
        }
    };

    if (!isLoggedIn) {
        return <SignInPage onSignIn={handleSignIn} />;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                isSidebarOpen={isSidebarOpen} 
                setSidebarOpen={setSidebarOpen} 
                isMobileMenuOpen={isMobileMenuOpen} 
                setMobileMenuOpen={setMobileMenuOpen}
                handleSignOut={handleSignOut}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    isSidebarOpen={isSidebarOpen} 
                    setSidebarOpen={setSidebarOpen} 
                    isMobileMenuOpen={isMobileMenuOpen} 
                    setMobileMenuOpen={setMobileMenuOpen} 
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;