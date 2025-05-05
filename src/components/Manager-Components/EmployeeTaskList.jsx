import React, { useState } from "react";
import EmployeeTaskHistory from "./EmployeeTaskHistory";

const EmployeeTaskList = ({ currentEmployees, themeColors, statusFilter, allEmployees }) => {
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState("");

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return { backgroundColor: themeColors.success, color: "#FFFFFF" };
      case "in progress":
        return { backgroundColor: themeColors.warning, color: "#FFFFFF" };
      case "not started":
        return { backgroundColor: themeColors.danger, color: "#FFFFFF" };
      default:
        return { backgroundColor: themeColors.neutral, color: themeColors.textDark };
    }
  };

  const getPriorityColor = (priority) => {
    if (priority <= 3) return { backgroundColor: themeColors.success, color: "#FFFFFF" };
    if (priority <= 7) return { backgroundColor: themeColors.warning, color: "#FFFFFF" };
    return { backgroundColor: themeColors.danger, color: "#FFFFFF" };
  };

  const calculateTaskPercentages = (tasks) => {
    const total = tasks.length;
    if (total === 0) return { completed: 0, inProgress: 0, notStarted: 0 };

    const completed = tasks.filter((task) => task.status.toLowerCase() === "completed").length;
    const inProgress = tasks.filter((task) => task.status.toLowerCase() === "in progress").length;
    const notStarted = tasks.filter((task) => task.status.toLowerCase() === "not started").length;

    return {
      completed: Math.round((completed / total) * 100),
      inProgress: Math.round((inProgress / total) * 100),
      notStarted: Math.round((notStarted / total) * 100),
    };
  };

  const toggleEmployeeDetails = (employeeId) => {
    setExpandedEmployee(expandedEmployee === employeeId ? null : employeeId);
  };

  const openTaskHistory = (employeeId, username) => {
    setSelectedEmployeeId(employeeId);
    setSelectedUsername(username);
    setShowHistoryModal(true);
  };

  return (
    <div className="space-y-2 animate-slide-up">
      {currentEmployees.map((employee) => {
        const tasksToDisplay =
          statusFilter && statusFilter !== "total"
            ? employee.tasks.filter(
                (task) => task.status.toLowerCase() === statusFilter.toLowerCase()
              )
            : employee.tasks;
        const percentages = calculateTaskPercentages(employee.tasks);

        return (
          <div key={employee.employeeId} className="card">
            <div
              className="p-5 flex justify-between items-center cursor-pointer"
              onClick={() => toggleEmployeeDetails(employee.employeeId)}
            >
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-1">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-soft-purple/10">
                    <span className="text-base font-medium text-soft-purple">
                      {employee.username.charAt(0).toUpperCase()}
                    </span>
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-medium text-text-color">{employee.username}</h3>
                  <p className="text-sm text-neutral-500">Tasks: {employee.tasks.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openTaskHistory(employee.employeeId, employee.username);
                  }}
                  className="text-sm text-soft-purple hover:text-soft-purple/70 transition-colors"
                  aria-label={`View all tasks for ${employee.username}`}
                >
                  View All Tasks
                </button>
                <svg
                  className={`w-4 h-4 text-neutral-600 transition-transform ${
                    expandedEmployee === employee.employeeId ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div className="px-5 pb-2">
              <div className="flex items-center justify-center">
                <div
                  className="flex w-full max-w-md h-2 rounded-full overflow-hidden bg-neutral-100"
                  role="progressbar"
                  aria-label={`Task status distribution for ${employee.username}`}
                >
                  {percentages.completed > 0 && (
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${percentages.completed}%`,
                        backgroundColor: themeColors.success,
                      }}
                      title={`Completed: ${percentages.completed}%`}
                    ></div>
                  )}
                  {percentages.inProgress > 0 && (
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${percentages.inProgress}%`,
                        backgroundColor: themeColors.warning,
                      }}
                      title={`In Progress: ${percentages.inProgress}%`}
                    ></div>
                  )}
                  {percentages.notStarted > 0 && (
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${percentages.notStarted}%`,
                        backgroundColor: themeColors.danger,
                      }}
                      title={`Not Started: ${percentages.notStarted}%`}
                    ></div>
                  )}
                </div>
              </div>
              <div className="flex justify-center mt-2 space-x-4 text-xs text-neutral-600">
                <span>
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: themeColors.success }}
                  ></span>
                  Completed: {percentages.completed}%
                </span>
                <span>
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: themeColors.warning }}
                  ></span>
                  In Progress: {percentages.inProgress}%
                </span>
                <span>
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: themeColors.danger }}
                  ></span>
                  Not Started: {percentages.notStarted}%
                </span>
              </div>
            </div>
            {expandedEmployee === employee.employeeId && (
              <div className="p-5 border-t border-neutral-100">
                {tasksToDisplay.length === 0 ? (
                  <p className="text-sm text-neutral-600">No tasks to display.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="table-header">
                          <th className="p-3 text-left">Topic</th>
                          <th className="p-3 text-left">Sub Topic</th>
                          <th className="p-3 text-left">Description</th>
                          <th className="p-3 text-center">Expected Hours</th>
                          <th className="p-3 text-center">Completed Hours</th>
                          <th className="p-3 text-left">Start Date</th>
                          <th className="p-3 text-left">End Date</th>
                          <th className="p-3 text-center">Priority</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasksToDisplay.map((task) => (
                          <tr key={task.taskId} className="table-row">
                            <td className="p-3 font-medium text-text-color">{task.topic}</td>
                            <td className="p-3 text-neutral-600">{task.subTopic}</td>
                            <td className="p-3 text-neutral-600">{task.description}</td>
                            <td className="p-3 text-center text-text-color">{task.expectedHours}</td>
                            <td className="p-3 text-center text-text-color">{task.completedHours}</td>
                            <td className="p-3 text-neutral-600">
                              {new Date(task.startDate).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-neutral-600">
                              {new Date(task.endDate).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className="px-2 py-1 rounded-full text-xs font-medium"
                                style={getPriorityColor(task.priority)}
                              >
                                {task.priority}
                              </span>
                            </td>
                            <td className="p-3 text-center">
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
            )}
          </div>
        );
      })}

      {showHistoryModal && (
        <EmployeeTaskHistory
          employeeId={selectedEmployeeId}
          username={selectedUsername}
          onClose={() => setShowHistoryModal(false)}
          themeColors={themeColors}
        />
      )}
    </div>
  );
};

export default EmployeeTaskList;