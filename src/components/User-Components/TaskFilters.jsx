import React from "react";
import { Search, LayoutGrid, Columns, Calendar } from "lucide-react";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskFilters = ({
  currentView,
  setCurrentView,
  taskFilterType,
  setTaskFilterType,
  showActiveTasks,
  setShowActiveTasks,
  showOverdueTasks,
  setShowOverdueTasks,
  kanbanDate,
  gridDate,
  setKanbanDate,
  setGridDate,
  showDateFilter,
  setShowDateFilter,
  searchTerm,
  setSearchTerm,
  employeeId,
  fetchTasksByDate,
  fetchTasksByFilterType,
  fetchActiveTasks,
  fetchOverdueTasks,
  statusFilter, 
  setStatusFilter,
}) => {
  const STATUS_CONFIG = {
    "Not Started": { label: "Not Started" },
    "In Progress": { label: "In Progress" },
    Completed: { label: "Completed" },
  };

  const handleStatusFilterChange = (value) => {
    console.log("TaskFilters: Changing status filter to:", value);
    setStatusFilter(value);
  };

  return (
    <div className="mb-4 flex flex-wrap gap-4 items-center">
      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentView("kanban")  }
          className={`p-2 rounded-md ${currentView === "kanban" ? "bg-blue-100 text-blue-700" : "text-gray-600"}` } title="Kanban View"
        >
          <Columns className="h-5 w-5" />
        </button>
        <button
          onClick={() => setCurrentView("grid")}
          className={`p-2 rounded-md ${currentView === "grid" ? "bg-blue-100 text-blue-700" : "text-gray-600"}`} title="Grid View"
        >
          <LayoutGrid className="h-5 w-5" />
        </button>
      </div>

      {/* Task Type Filter */}
      <select
        value={taskFilterType}
        onChange={(e) => {
          setTaskFilterType(e.target.value);
          fetchTasksByFilterType(employeeId, e.target.value);
        }}
        className="border rounded-md px-2 py-1"
      >
        <option value="all">All Tasks</option>
        <option value="private">My Tasks</option>
        <option value="assigned">Assigned Tasks</option>
      </select>

      {/* Status Filter */}
      {!showActiveTasks && !showOverdueTasks && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="border rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All</option>
            {Object.keys(STATUS_CONFIG).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Active/Overdue Toggles */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setShowActiveTasks(!showActiveTasks);
            if (!showActiveTasks) fetchActiveTasks(employeeId);
            else fetchTasksByFilterType(employeeId, taskFilterType);
          }}
          className={`px-3 py-1 rounded-md ${showActiveTasks ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
        >
          Active Tasks
        </button>
        <button
          onClick={() => {
            setShowOverdueTasks(!showOverdueTasks);
            if (!showOverdueTasks) fetchOverdueTasks(employeeId);
            else fetchTasksByFilterType(employeeId, taskFilterType);
          }}
          className={`px-3 py-1 rounded-md ${showOverdueTasks ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
        >
          Overdue Tasks
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center border rounded-md px-2 py-1">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks..."
          className="outline-none"
        />
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowDateFilter(!showDateFilter)}
          // className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md flex items-center"
        >
          <Calendar className="h-5 w-5 mr-1" />
        </button>
        




        
        

        {showDateFilter && (
          <input
            type="date"
            value={currentView === "kanban" ? kanbanDate : gridDate}
            onChange={(e) => {
              const date = e.target.value;
              if (currentView === "kanban") setKanbanDate(date);
              else setGridDate(date);
              if (date) fetchTasksByDate(employeeId, date);
            }}
            className="border rounded-md px-2 py-1"
          />
        )}
      </div>
    </div>
  );
};

export default TaskFilters;