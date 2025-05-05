import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../config";

const EmployeeTaskHistory = ({ employeeId, username, themeColors, onClose }) => {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); 
  const [sortField, setSortField] = useState("endDate");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    fetchAllEmployeeTasks();
  }, [employeeId]);

  const fetchAllEmployeeTasks = () => {
    setLoading(true);
    setError("");

    axios
      .get(`${apiUrl}/api/Tasks/employee/${employeeId}`)
      .then((response) => {
        setAllTasks(response.data);
      })
      .catch((err) => {
        console.error("Error fetching employee task history:", err);
        setError(
          "Failed to load task history. " +
            (err.response?.data?.message || err.message)
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return { backgroundColor: "#ECFDF5", color: "#065F46" };
      case "in progress":
        return { backgroundColor: themeColors.light, color: themeColors.primary };
      case "not started":
        return { backgroundColor: "#FFF4E5", color: themeColors.secondary };
      default:
        return { backgroundColor: "#F3F4F6", color: "#374151" };
    }
  };

  const getPriorityColor = (priority) => {
    if (priority <= 3)
      return { backgroundColor: "#ECFDF5", color: "#065F46" };
    if (priority <= 7)
      return { backgroundColor: "#FFEDD5", color: themeColors.secondary };
    return { backgroundColor: "#FEE2E2", color: "#B91C1C" };
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getFilteredAndSortedTasks = () => {
    let filtered = [...allTasks];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((task) =>
        task.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.subTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter based on clicked card
    if (selectedStatus) {
      filtered = filtered.filter(
        (task) => task.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle special cases for date fields
      if (sortField === "startDate" || sortField === "endDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // For numeric fields
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // For date objects
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // For strings
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return filtered;
  };

  const filteredTasks = getFilteredAndSortedTasks();

  // Calculate stats for the employee
  const completedTasks = allTasks.filter(
    (task) => task.status.toLowerCase() === "completed"
  ).length;
  const inProgressTasks = allTasks.filter(
    (task) => task.status.toLowerCase() === "in progress"
  ).length;
  const notStartedTasks = allTasks.filter(
    (task) => task.status.toLowerCase() === "not started"
  ).length;

  // Get sort indicator
  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center" style={{ backgroundColor: themeColors.light }}>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: themeColors.primary }}>
              Task History for {username}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Employee ID: {employeeId}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Stats Cards with Clickable Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b bg-gray-50">
          <div
            className="bg-white p-3 rounded-lg shadow border-l-4 cursor-pointer hover:bg-gray-100"
            style={{ borderLeftColor: themeColors.primary }}
            onClick={() => setSelectedStatus("")}
          >
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-2xl font-bold">{allTasks.length}</p>
          </div>
          <div
            className="bg-white p-3 rounded-lg shadow border-l-4 cursor-pointer hover:bg-gray-100"
            style={{ borderLeftColor: themeColors.success }}
            onClick={() => setSelectedStatus("completed")}
          >
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold">{completedTasks}</p>
          </div>
          <div
            className="bg-white p-3 rounded-lg shadow border-l-4 cursor-pointer hover:bg-gray-100"
            style={{ borderLeftColor: themeColors.warning }}
            onClick={() => setSelectedStatus("in progress")}
          >
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold">{inProgressTasks}</p>
          </div>
          <div
            className="bg-white p-3 rounded-lg shadow border-l-4 cursor-pointer hover:bg-gray-100"
            style={{ borderLeftColor: themeColors.danger }}
            onClick={() => setSelectedStatus("not started")}
          >
            <p className="text-sm text-gray-500">Not Started</p>
            <p className="text-2xl font-bold">{notStartedTasks}</p>
          </div>
        </div>

        {/* Search Filter */}
        <div className="p-4 flex flex-wrap gap-3 border-b">
          <div className="w-full md:w-auto flex-grow">
            <label className="text-sm font-medium mb-1 block">Search Tasks</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by topic, subtopic, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
              />
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="flex-grow overflow-auto p-4">
          {loading && (
            <div className="flex justify-center my-8">
              <div
                className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2"
                style={{ borderColor: themeColors.primary }}
              ></div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-700 text-center my-4">
              {error}
            </div>
          )}

          {!loading && filteredTasks.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-lg shadow">
              <p className="text-gray-600 text-lg">No tasks found for this employee</p>
            </div>
          )}

          {!loading && filteredTasks.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      className="p-3 text-left font-medium cursor-pointer"
                      style={{ color: themeColors.primary }}
                      onClick={() => handleSort("topic")}
                    >
                      Topic {getSortIndicator("topic")}
                    </th>
                    <th
                      className="p-3 text-left font-medium cursor-pointer"
                      style={{ color: themeColors.primary }}
                      onClick={() => handleSort("subTopic")}
                    >
                      Sub Topic {getSortIndicator("subTopic")}
                    </th>
                    <th
                      className="p-3 text-left font-medium"
                      style={{ color: themeColors.primary }}
                    >
                      Description
                    </th>
                    <th
                      className="p-3 text-left font-medium cursor-pointer"
                      style={{ color: themeColors.primary }}
                      onClick={() => handleSort("expectedHours")}
                    >
                      Expected Hours {getSortIndicator("expectedHours")}
                    </th>
                    <th
                      className="p-3 text-left font-medium cursor-pointer"
                      style={{ color: themeColors.primary }}
                      onClick={() => handleSort("completedHours")}
                    >
                      Completed Hours {getSortIndicator("completedHours")}
                    </th>
                    <th
                      className="p-3 text-left font-medium cursor-pointer"
                      style={{ color: themeColors.primary }}
                      onClick={() => handleSort("startDate")}
                    >
                      Start Date {getSortIndicator("startDate")}
                    </th>
                    <th
                      className="p-3 text-left font-medium cursor-pointer"
                      style={{ color: themeColors.primary }}
                      onClick={() => handleSort("endDate")}
                    >
                      End Date {getSortIndicator("endDate")}
                    </th>
                    <th
                      className="p-3 text-left font-medium cursor-pointer"
                      style={{ color: themeColors.primary }}
                      onClick={() => handleSort("priority")}
                    >
                      Priority {getSortIndicator("priority")}
                    </th>
                    <th
                      className="p-3 text-left font-medium cursor-pointer"
                      style={{ color: themeColors.primary }}
                      onClick={() => handleSort("status")}
                    >
                      Status {getSortIndicator("status")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.taskId} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium" style={{ color: themeColors.primary }}>
                        {task.topic}
                      </td>
                      <td className="p-3">{task.subTopic}</td>
                      <td className="p-3 max-w-xs truncate">{task.description}</td>
                      <td className="p-3 text-center">{task.expectedHours}</td>
                      <td className="p-3 text-center font-medium">{task.completedHours}</td>
                      <td className="p-3">{new Date(task.startDate).toLocaleDateString()}</td>
                      <td className="p-3">{new Date(task.endDate).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={getPriorityColor(task.priority)}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={getStatusColor(task.status)}
                        >
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">
              Showing {filteredTasks.length} of {allTasks.length} tasks
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTaskHistory;