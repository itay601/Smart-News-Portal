import React from 'react';
import { BarChart2, MessageSquare, Search, Database, Settings, LogOut, ChevronLeft, GitGraphIcon, LucideArchiveX, Calendar, Home } from 'lucide-react';
import NavItem from './NavItem';
import { Link } from "react-router-dom";

const Sidebar = ({ activePage, setActivePage, isSidebarOpen, setSidebarOpen, isMobileMenuOpen, setMobileMenuOpen, handleSignOut }) => {
    //const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    const parsedUser = typeof userData === "string" ? JSON.parse(userData) : userData;

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className={`flex items-center ${!isSidebarOpen && 'justify-center w-full'}`}>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">S</span>
                    </div>
                    {isSidebarOpen && <span className="ml-3 text-xl font-bold text-gray-900">SaasApp</span>}
                </div>
                {isSidebarOpen && (
                    <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-800 hidden lg:block">
                        <ChevronLeft />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-grow px-2 py-4">
                <ul>
                    <NavItem icon={<BarChart2 size={20} />} label="Dashboard" isActive={activePage === 'Dashboard'} onClick={() => setActivePage('Dashboard')} />
                    <NavItem icon={<MessageSquare size={20} />} label="Chat Agent" isActive={activePage === 'Chat Agent'} onClick={() => setActivePage('Chat Agent')} />
                    <NavItem icon={<Search size={20} />} label="Agent Analysis" isActive={activePage === 'Agent Analysis'} onClick={() => setActivePage('Agent Analysis')} />
                    <NavItem icon={<LucideArchiveX size={20} />} label="Data Fetching" isActive={activePage === 'Data Fetching'} onClick={() => setActivePage('Data Fetching')} />
                    <NavItem icon={<GitGraphIcon size={20} />} label="Stocks Fetching" isActive={activePage === 'Stocks Fetching'} onClick={() => setActivePage('Stocks Fetching')} />
                    <NavItem icon={<Database size={20} />} label="Data Center" isActive={activePage === 'Data Center'} onClick={() => setActivePage('Data Center')} />
                    <NavItem icon={<Calendar size={20} />} label="Calendar" isActive={activePage === 'Calendar'} onClick={() => setActivePage('Calendar')} />

                </ul>
            </nav>

            {/* Footer */}
            <div className="px-2 py-4 border-t">
                <ul>
                    <li>
                        <Link to="/">
                            <NavItem icon={<Home size={20} />} label="Home-Page" />
                        </Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="/settings">
                            <NavItem icon={<Settings size={20} />} label="Settings" />
                        </Link>
                    </li>
                </ul>
                
                <div className="p-3 mt-4 rounded-lg bg-gray-100 flex items-center">
                    <img src="https://placehold.co/40x40/E2E8F0/4A5568?text=U" alt="User" className="w-10 h-10 rounded-full" />
                    {isSidebarOpen && (
                        <div className="ml-3">
                            <p className="font-semibold text-sm">{parsedUser.username}</p>
                            <p className="text-xs text-gray-500">{parsedUser.email}</p>
                        </div>
                    )}
                </div>
                <button onClick={handleSignOut} className="w-full flex items-center p-3 mt-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-red-100 hover:text-red-600">
                    <LogOut size={20} />
                    <span className={`ml-4 font-medium ${isSidebarOpen ? 'inline' : 'hidden'}`}>Sign Out</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`bg-white border-r transition-all duration-300 ease-in-out hidden lg:block ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                {sidebarContent}
            </aside>
            
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-black opacity-30" onClick={() => setMobileMenuOpen(false)}></div>
                <aside className={`absolute top-0 left-0 h-full bg-white w-64 z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {sidebarContent}
                </aside>
            </div>
        </>
    );
};

export default Sidebar;