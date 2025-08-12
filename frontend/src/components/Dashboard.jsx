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
    Bell,
    Calendar
    
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
import SaasHomepage from './SaasHomePage';
import Calender from './Calender';


const Dashboard = ({user, onLogout}) => {
    const [activePage, setActivePage] = useState('Dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSignIn = () => setIsLoggedIn(true);
    
    if (!user && !isLoggedIn) {
        return <SignInPage onSignIn={handleSignIn} />;
    }

    const handleSignOut = () => {
        if (onLogout) {
            onLogout();
        }
        // Clear stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Redirect to home route
        window.location.href = '/';
    };

    const renderPage = () => {
        switch (activePage) {
            case 'Dashboard':
                return <DashboardHome user={user} />;
            case 'Chat Agent':
                return <ChatAgentPage user={user} />;
            case 'Agent Analysis':
                return <AgentAnalysisPage user={user} />;
            case 'Data Fetching':
                return <DataFetchingPage user={user} />;
            case 'Stocks Fetching':
                return <StocksFetch user={user} />;
            case 'Data Center':
                return <DataCenter user={user} />;    
            case 'Calendar':
                return <Calender user={user} />;    
            default:
                return <DashboardHome user={user} />;
        }
    };

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
                user={user}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    isSidebarOpen={isSidebarOpen} 
                    setSidebarOpen={setSidebarOpen} 
                    isMobileMenuOpen={isMobileMenuOpen} 
                    setMobileMenuOpen={setMobileMenuOpen}
                    user={user}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;