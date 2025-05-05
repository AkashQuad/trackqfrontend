import React from "react";

const ControlsPanel = ({ 
    selectedDate, 
    formatDateForInput, 
    handleDateChange, 
    searchQuery, 
    handleSearchChange, 
    employeesPerPage, 
    handleEmployeesPerPageChange, 
    themeColors 
}) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6 w-full">
            <div className="flex flex-wrap md:flex-nowrap gap-4 items-end">
                {/* Date Input */}
                <div className="w-full md:w-64">
                    <label className="block text-sm font-medium mb-1" style={{ color: themeColors.primary }}>
                        Select Date
                    </label>
                    <input
                        type="date"
                        value={formatDateForInput(selectedDate)}
                        onChange={handleDateChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300"
                        style={{ borderColor: '#e2e8f0' }}
                    />
                </div>

                {/* Search functlity*/}
                <div className="w-full md:w-64">
                    <label className="block text-sm font-medium mb-1" style={{ color: themeColors.primary }}>
                        Search Employees
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or id....."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300"
                            style={{ borderColor: '#e2e8f0' }}
                        />
                    </div>
                </div>
                
                {/* Items per page dropdown */}
                <div className="w-full md:w-40">
                    <label className="block text-sm font-medium mb-1" style={{ color: themeColors.primary }}>
                        Show per page
                    </label>
                    <select
                        value={employeesPerPage}
                        onChange={handleEmployeesPerPageChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300"
                        style={{ borderColor: '#e2e8f0' }}
                    >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                </div>
                
            </div>
        </div>
    );
};

export default ControlsPanel;