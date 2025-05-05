
import React, { useState } from 'react';
import EmployeeList from './EmployeeList';
import CsvUpload from './CsvUpload';
import { Users, Upload, User } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const name = localStorage.getItem("UserName");
  const email = localStorage.getItem("email");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
          <div className={`font-bold text-xl text-blue-600 ${!sidebarOpen && 'hidden'}`}>
            Admin
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sidebarOpen ? (
                <path d="M15 18l-6-6 6-6" />
              ) : (
                <path d="M9 18l6-6-6-6" />
              )}
            </svg>
          </button>
        </div>
        
        <div className="mt-8">
          <SidebarItem 
            icon={<Users size={20} />} 
            title="Employees" 
            active={activeTab === 'employees'} 
            collapsed={!sidebarOpen}
            onClick={() => setActiveTab('employees')} 
          />
          <SidebarItem 
            icon={<Upload size={20} />} 
            title="Import" 
            active={activeTab === 'import'} 
            collapsed={!sidebarOpen}
            onClick={() => setActiveTab('import')} 
          />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User size={16} />
            </div>
            {sidebarOpen && (
              <div className="ml-3 flex flex-col">
                <div className="text-sm font-medium">{name}</div>
                <div className="text-xs text-gray-500 truncate w-40" title={email}>{email}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">        
        <main className="p-6">
          {activeTab === 'employees' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-5">
         
              <h2 className="text-lg font-medium mb-4">Employee Data Management</h2>
                <EmployeeList />
              </div>
            </div>
          )}
          
          {activeTab === 'import' && (
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-lg font-medium mb-4">Import Employee Data</h2>
              <CsvUpload />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// we should add so more .....
// this is Helper component to sidebar items  
const SidebarItem = ({ icon, title, active, collapsed, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'} ${collapsed ? 'justify-center' : ''}`}
    >
      <div>{icon}</div>
      {!collapsed && <div className="ml-3 font-medium">{title}</div>}
    </button>
  );
};

export default AdminDashboard;
