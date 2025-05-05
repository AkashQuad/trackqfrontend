import React from "react";

const TaskControls = ({
  selectedDate,
  formatDateForInput,
  handleDateChange,
  searchQuery,
  handleSearchChange,
  employeesPerPage,
  handleEmployeesPerPageChange,
  themeColors,
  setShowAssignModal,
  setShowCreateTeamModal,
}) => {
  return (
    <div className="card p-6 mb-12 animate-slide-up">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="w-full md:w-44">
            <label className="block text-sm text-neutral-600 mb-1">Select Date</label>
            <input
              type="date"
              value={formatDateForInput(selectedDate)}
              onChange={handleDateChange}
              className="input-field"
            />
          </div>
          <div className="w-full md:w-60">
            <label className="block text-sm text-neutral-600 mb-1">Search Employees</label>
            <div className="relative">
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-neutral-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="input-field pl-9"
              />
            </div>
          </div>
          <div className="w-full md:w-28">
            <label className="block text-sm text-neutral-600 mb-1">Per Page</label>
            <select
              value={employeesPerPage}
              onChange={handleEmployeesPerPageChange}
              className="input-field"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowAssignModal(true)}
            className="btn-primary flex-1 md:flex-none"
            aria-label="Assign new task"
          >
            Assign Task
          </button>
          <button
            onClick={() => setShowCreateTeamModal(true)}
            className="btn-secondary flex-1 md:flex-none"
            aria-label="Create new team"
          >
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskControls;