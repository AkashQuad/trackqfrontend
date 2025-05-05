import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../config";

const AssignTaskModal = ({
  setShowAssignModal,
  assignTaskForm,
  setAssignTaskForm,
  assignLoading,
  assignSuccess,
  assignError,
  setAssignLoading,
  setAssignSuccess,
  setAssignError,
  themeColors,
  employeeTasks,
  selectedDate,
  setSelectedDate,
  fetchEmployeeTasks,
  userId,
  teams,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [teamMembers, setTeamMembers] = useState({});
  const [fetchingTeamMembers, setFetchingTeamMembers] = useState(false);

  const allOptions = [
    ...employeeTasks.map((employee) => ({
      type: "employee",
      id: employee.employeeId,
      label: employee.username,
    })),
    ...teams.map((team) => ({
      type: "team",
      id: team.teamId,
      label: team.teamName,
    })),
  ];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredOptions(
      query.trim() === ""
        ? allOptions
        : allOptions.filter((option) =>
            option.label.toLowerCase().includes(query.toLowerCase())
          )
    );
  };

  useEffect(() => {
    setFilteredOptions(allOptions);
  }, [employeeTasks, teams]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const selectedTeamIds = assignTaskForm.teamIds || [];
      if (selectedTeamIds.length === 0) return;

      setFetchingTeamMembers(true);
      const newTeamMembers = { ...teamMembers };

      for (const teamId of selectedTeamIds) {
        try {
          const response = await axios.get(`${apiUrl}/api/Team/members/${teamId}`);
          newTeamMembers[teamId] = response.data;
        } catch (error) {
          newTeamMembers[teamId] = [];
        }
      }

      setTeamMembers(newTeamMembers);
      setFetchingTeamMembers(false);
    };

    fetchTeamMembers();
  }, [assignTaskForm.teamIds]);

  const handleSelectionChange = (option) => {
    const { type, id } = option;
    const currentEmployeeIds = [...(assignTaskForm.employeeIds || [])];
    const currentTeamIds = [...(assignTaskForm.teamIds || [])];

    if (type === "employee") {
      setAssignTaskForm({
        ...assignTaskForm,
        employeeIds: currentEmployeeIds.includes(id)
          ? currentEmployeeIds.filter((eid) => eid !== id)
          : [...currentEmployeeIds, id],
      });
    } else {
      setAssignTaskForm({
        ...assignTaskForm,
        teamIds: currentTeamIds.includes(id)
          ? currentTeamIds.filter((tid) => tid !== id)
          : [...currentTeamIds, id],
      });
    }
  };

  const handleAssignFormChange = (e) => {
    const { name, value } = e.target;
    setAssignTaskForm({
      ...assignTaskForm,
      [name]: name === "expectedHours" || name === "priority" ? parseFloat(value) : value,
    });
  };

  const getTeamMemberIds = () => {
    const selectedTeamIds = assignTaskForm.teamIds || [];
    const memberIds = [];

    selectedTeamIds.forEach((teamId) => {
      const members = teamMembers[teamId] || [];
      members.forEach((member) => {
        if (member.employeeId && !memberIds.includes(member.employeeId)) {
          memberIds.push(member.employeeId);
        }
      });
    });

    return memberIds;
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setAssignLoading(true);
    setAssignError("");
    setAssignSuccess(false);

    let allEmployeeIds = [...(assignTaskForm.employeeIds || []), ...getTeamMemberIds()];
    allEmployeeIds = [...new Set(allEmployeeIds)];

    if (allEmployeeIds.length === 0) {
      setAssignError("Select at least one employee or team with members");
      setAssignLoading(false);
      return;
    }

    const currentDate = new Date().toISOString();
    const taskDate = new Date(assignTaskForm.startDate);

    try {
      const assignmentPromises = allEmployeeIds.map((employeeId) => {
        const taskData = {
          employeeId,
          topic: assignTaskForm.topic,
          subTopic: assignTaskForm.subTopic || "",
          description: assignTaskForm.description,
          expectedHours: parseFloat(assignTaskForm.expectedHours),
          priority: parseInt(assignTaskForm.priority),
          startDate: taskDate.toISOString(),
          endDate: new Date(assignTaskForm.endDate).toISOString(),
          status: assignTaskForm.status,
          date: taskDate.toISOString(),
          completedHours: 0,
          assignedBy: parseInt(userId),
          assignedDate: currentDate,
        };
        return axios.post(`${apiUrl}/api/Manager/assign`, taskData);
      });

      await Promise.all(assignmentPromises);

      setAssignSuccess(true);
      setAssignTaskForm({
        employeeIds: [],
        teamIds: [],
        topic: "",
        subTopic: "",
        description: "",
        expectedHours: 0,
        priority: 1,
        startDate: assignTaskForm.startDate,
        endDate: assignTaskForm.endDate,
        status: "Not Started",
      });

      alert(`Tasks assigned to ${allEmployeeIds.length} employee(s) for ${taskDate.toLocaleDateString()}`);

      if (taskDate.toDateString() === selectedDate.toDateString()) {
        setTimeout(() => fetchEmployeeTasks(selectedDate), 100);
      } else if (window.confirm("View tasks on the assigned date?")) {
        setSelectedDate(taskDate);
      }

      setShowAssignModal(false);
      setAssignSuccess(false);
    } catch (err) {
      setAssignError(err.response?.data?.message || "Failed to assign tasks.");
    } finally {
      setAssignLoading(false);
    }
  };

  const calculateTotalAssignees = () => {
    return new Set([...(assignTaskForm.employeeIds || []), ...getTeamMemberIds()]).size;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="p-3 border-b">
          <h3 className="text-lg font-semibold" style={{ color: themeColors.primary }}>
            Assign Task
          </h3>
          <p className="text-xs text-gray-500">Tasks assigned to the start date</p>
        </div>

        <form onSubmit={handleAssignTask} className="p-3">
          {(assignSuccess || assignError) && (
            <div
              className={`mb-2 p-2 rounded text-xs ${
                assignSuccess ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {assignSuccess ? "Tasks assigned successfully!" : assignError}
            </div>
          )}

          <div className="mb-3">
            <label className="block text-xs font-medium mb-1">Employees/Teams</label>
            <div className="relative mb-1">
              <svg
                className="absolute left-2 top-2 h-4 w-4 text-gray-400"
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
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-8 pr-2 py-1 border rounded text-sm"
                style={{ borderColor: "#e2e8f0" }}
              />
            </div>
            <div className="max-h-28 overflow-y-auto border rounded p-1">
              {filteredOptions.length ? (
                filteredOptions.map((option) => (
                  <div key={`${option.type}-${option.id}`} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`${option.type}-${option.id}`}
                      checked={
                        option.type === "employee"
                          ? assignTaskForm.employeeIds?.includes(option.id)
                          : assignTaskForm.teamIds?.includes(option.id)
                      }
                      onChange={() => handleSelectionChange(option)}
                      className="h-3 w-3"
                    />
                    <label htmlFor={`${option.type}-${option.id}`} className="ml-1 text-xs">
                      {option.label} {option.type === "team" ? "(Team)" : ""}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-center py-1 text-gray-500 text-xs">
                  No matches for "{searchQuery}"
                </div>
              )}
            </div>
            {assignTaskForm.teamIds?.length > 0 && (
              <div className="mt-1 p-1 bg-gray-50 rounded text-xs">
                {fetchingTeamMembers ? (
                  <div className="flex items-center text-gray-500">
                    <div
                      className="animate-spin h-3 w-3 mr-1 border-2 border-t-transparent rounded-full"
                      style={{ borderColor: themeColors.primary }}
                    ></div>
                    Loading...
                  </div>
                ) : (
                  assignTaskForm.teamIds.map((teamId) => {
                    const team = teams.find((t) => t.teamId === teamId);
                    const members = teamMembers[teamId] || [];
                    return (
                      <div key={teamId} className="mb-1">
                        <p className="font-medium">{team?.teamName}:</p>
                        {members.length ? (
                          <ul className="pl-2 text-gray-600">
                            {members.map((member) => (
                              <li key={member.employeeId}>{member.name || member.username}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">No members</p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
            <div className="mt-1 text-xs text-gray-500">
              {calculateTotalAssignees()} employee(s) will be assigned
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-xs font-medium mb-1">Topic</label>
              <input
                type="text"
                name="topic"
                value={assignTaskForm.topic}
                onChange={handleAssignFormChange}
                required
                className="w-full px-2 py-1 border rounded text-sm"
                style={{ borderColor: "#e2e8f0" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Sub Topic</label>
              <input
                type="text"
                name="subTopic"
                value={assignTaskForm.subTopic}
                onChange={handleAssignFormChange}
                className="w-full px-2 py-1 border rounded text-sm"
                style={{ borderColor: "#e2e8f0" }}
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-xs font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={assignTaskForm.description}
              onChange={handleAssignFormChange}
              required
              rows="2"
              className="w-full px-2 py-1 border rounded text-sm"
              style={{ borderColor: "#e2e8f0" }}
            ></textarea>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-2">
            <div>
              <label className="block text-xs font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={assignTaskForm.startDate}
                onChange={handleAssignFormChange}
                required
                className="w-full px-1 py-1 border rounded text-xs"
                style={{ borderColor: "#e2e8f0" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={assignTaskForm.endDate}
                onChange={handleAssignFormChange}
                required
                className="w-full px-1 py-1 border rounded text-xs"
                style={{ borderColor: "#e2e8f0" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Priority</label>
              <input
                type="number"
                name="priority"
                value={assignTaskForm.priority}
                onChange={handleAssignFormChange}
                min="1"
                max="10"
                required
                className="w-full px-1 py-1 border rounded text-xs"
                style={{ borderColor: "#e2e8f0" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Status</label>
              <select
                name="status"
                value={assignTaskForm.status}
                onChange={handleAssignFormChange}
                required
                className="w-full px-1 py-1 border rounded text-xs"
                style={{ borderColor: "#e2e8f0" }}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-xs font-medium mb-1">Expected Hours</label>
            <input
              type="number"
              name="expectedHours"
              value={assignTaskForm.expectedHours}
              onChange={handleAssignFormChange}
              min="0"
              step="0.5"
              required
              className="w-full px-2 py-1 border rounded text-sm"
              style={{ borderColor: "#e2e8f0" }}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAssignModal(false)}
              className="px-3 py-1 rounded border border-gray-300 text-gray-700 text-xs hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={assignLoading}
              className="px-3 py-1 rounded text-white text-xs flex items-center"
              style={{ backgroundColor: themeColors.primary }}
            >
              {assignLoading ? (
                <>
                  <div
                    className="animate-spin h-3 w-3 mr-1 border-2 border-white border-t-transparent rounded-full"
                  ></div>
                  Assigning...
                </>
              ) : (
                "Assign"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;