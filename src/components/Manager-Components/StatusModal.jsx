import React, { useState } from "react";

const StatusModal = ({ statusFilter, themeColors, filteredEmployeeTasks, setShowStatusModal }) => {
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());

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

  const handleCheckboxChange = (employeeId) => {
    const newSelectedEmployees = new Set(selectedEmployees);
    if (newSelectedEmployees.has(employeeId)) {
      newSelectedEmployees.delete(employeeId);
    } else {
      newSelectedEmployees.add(employeeId);
    }
    setSelectedEmployees(newSelectedEmployees);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="modal p-6">
        <div className="flex justify-between items-center mb-4 border-b border-neutral-100 pb-4">
          <h3 className="text-base font-medium text-text-color">
            {statusFilter} Tasks
          </h3>
          <button
            onClick={() => setShowStatusModal(false)}
            aria-label={`Close ${statusFilter} tasks modal`}
          >
            <svg
              className="w-4 h-4 text-neutral-600 hover:text-neutral-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                {statusFilter.toLowerCase() === "not started" ? (
                  <>
                    <th className="p-3 text-left"></th>
                    <th className="p-3 text-left">Employee</th>
                    <th className="p-3 text-center">Not Started</th>
                    <th className="p-3 text-center">
                      <button
                        onClick={() => setShowAllTasks(!showAllTasks)}
                        className="text-soft-purple hover:text-soft-purple/80 font-medium"
                        disabled={selectedEmployees.size === 0 && !showAllTasks}
                      >
                        {showAllTasks ? "Hide Tasks" : "Show Tasks"}
                      </button>
                    </th>
                  </>
                ) : (
                  <>
                    <th className="p-3 text-left"></th>
                    <th className="p-3 text-left">Employee</th>
                    <th className="p-3 text-center">{statusFilter}</th>
                    <th className="p-3 text-center">
                      <button
                        onClick={() => setShowAllTasks(!showAllTasks)}
                        className="text-soft-purple hover:text-soft-purple/80 font-medium"
                        disabled={selectedEmployees.size === 0 && !showAllTasks}
                      >
                        {showAllTasks ? "Hide Tasks" : "Show Tasks"}
                      </button>
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {showAllTasks && selectedEmployees.size > 0 ? (
                Array.from(selectedEmployees).map((employeeId) => {
                  const employee = filteredEmployeeTasks.find((e) => e.employeeId === employeeId);
                  if (!employee) return null;
                  return employee.tasks
                    .filter((task) => task.status.toLowerCase() === statusFilter.toLowerCase())
                    .map((task) => (
                      <tr key={`${employee.employeeId}-${task.taskId}`} className="table-row">
                        <td className="p-3"></td>
                        <td className="p-3 text-text-color">{employee.username}</td>
                        <td className="p-3 text-neutral-600">{task.topic}</td>
                        <td className="p-3 text-center">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={getStatusColor(task.status)}
                          >
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ));
                })
              ) : (
                filteredEmployeeTasks.map((employee) => {
                  const taskCounts = employee.tasks.reduce(
                    (acc, task) => {
                      acc[task.status.toLowerCase()] = (acc[task.status.toLowerCase()] || 0) + 1;
                      return acc;
                    },
                    { "not started": 0, completed: 0, "in progress": 0 }
                  );
                  return (
                    <tr key={employee.employeeId} className="table-row">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.has(employee.employeeId)}
                          onChange={() => handleCheckboxChange(employee.employeeId)}
                          className="h-4 w-4 text-soft-purple focus:ring-soft-purple/30"
                        />
                      </td>
                      <td className="p-3 text-text-color">{employee.username}</td>
                      <td className="p-3 text-center text-text-color">
                        {statusFilter.toLowerCase() === "not started"
                          ? taskCounts["not started"]
                          : statusFilter.toLowerCase() === "completed"
                          ? taskCounts.completed
                          : statusFilter.toLowerCase() === "in progress"
                          ? taskCounts["in progress"]
                          : 0}
                      </td>
                      <td className="p-3 text-center"></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filteredEmployeeTasks.every((employee) =>
          employee.tasks.length === 0
        ) && (
          <p className="text-sm text-neutral-600 mt-4 text-center">
            No tasks found.
          </p>
        )}
      </div>
    </div>
  );
};

export default StatusModal;