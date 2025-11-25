'use client';

import { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';
import NotificationPopup from './NotificationPopup';
import MonitoringPopup from './MonitoringPopup';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMonitoring, setShowMonitoring] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Hello Sir</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search here..."
                className="pl-10 pr-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-gray-600 relative cursor-pointer"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              
              {showNotifications && (
                <NotificationPopup 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)} 
                />
              )}
            </div>
            
            {/* Profile */}
            <div className="relative">
              <button 
                onClick={() => setShowMonitoring(!showMonitoring)}
                className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              </button>
              
              {showMonitoring && (
                <MonitoringPopup 
                  isOpen={showMonitoring} 
                  onClose={() => setShowMonitoring(false)} 
                />
              )}
            </div>
          </div>
        </div>
      </header>


    </>
  );
}