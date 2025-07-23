import React from 'react';
import { ChevronLeft, ChevronRight, Menu, Bell } from 'lucide-react';

const Header = ({ isSidebarOpen, setSidebarOpen, isMobileMenuOpen, setMobileMenuOpen }) => {
    return (
        <header className="flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center">
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-gray-800 hidden lg:block">
                    {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                </button>
                <button onClick={() => setMobileMenuOpen(true)} className="text-gray-500 hover:text-gray-800 lg:hidden">
                    <Menu />
                </button>
            </div>
            <div className="flex items-center gap-4">
                <button className="text-gray-500 hover:text-gray-800">
                    <Bell size={20} />
                </button>
                <img src="https://placehold.co/32x32/E2E8F0/4A5568?text=U" alt="User" className="w-8 h-8 rounded-full" />
            </div>
        </header>
    );
};

export default Header;