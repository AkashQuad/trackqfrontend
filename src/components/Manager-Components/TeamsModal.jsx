import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../config";

const TeamsModal = ({ teams, setShowTeamsModal, themeColors, userId, employeeTasks, fetchTeams }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teamInputs, setTeamInputs] = useState({});
  const [teamMembers, setTeamMembers] = useState({});
  const [operationStatus, setOperationStatus] = useState({});

  const filteredTeams = teams.filter((team) =>
    team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchAllTeamMembers = async () => {
      const membersData = {};
      for (const team of teams) {
        try {
          const response = await axios.get(`${apiUrl}/api/Team/members/${team.teamId}`);
          membersData[team.teamId] = response.data || [];
        } catch (err) {
          console.error(`Error fetching members for team ${team.teamId}:`, err);
          membersData[team.teamId] = [];
        }
      }
      setTeamMembers(membersData);
    };
    fetchAllTeamMembers();
  }, [teams]);

  const validateEmployeeId = (employeeId) => {
    return employeeTasks.some((employee) => employee.employeeId === parseInt(employeeId));
  };

  const handleInputChange = (teamId, value) => {
    setTeamInputs((prev) => ({ ...prev, [teamId]: value }));
  };

  const handleAddEmployee = async (teamId) => {
    const employeeId = teamInputs[teamId];
    if (!employeeId) {
      setOperationStatus((prev) => ({
        ...prev,
        [teamId]: { error: "Enter an employee ID", loading: false, success: "" },
      }));
      return;
    }

    if (!validateEmployeeId(employeeId)) {
      setOperationStatus((prev) => ({
        ...prev,
        [teamId]: { error: "Invalid employee ID", loading: false, success: "" },
      }));
      return;
    }

    setOperationStatus((prev) => ({ ...prev, [teamId]: { loading: true, error: "", success: "" } }));

    try {
      const payload = { teamId, employeeIds: [parseInt(employeeId)] }; // Changed to employeeIds array
      console.log("Sending payload:", payload); // Log the payload being sent
      const response = await axios.post(`${apiUrl}/api/Team/addMembers`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Add response:", response.data, response.status); // Log response data and status

      if (response.status === 200 || response.status === 201) {
        // Check if response contains updated members (adjust based on actual response structure)
        const updatedMembers = response.data.members || []; // Adjust 'members' to match backend response
        if (updatedMembers.some((member) => member.employeeId === parseInt(employeeId))) {
          setOperationStatus((prev) => ({
            ...prev,
            [teamId]: { success: `Employee ${employeeId} added`, loading: false, error: "" },
          }));
          setTeamMembers((prev) => ({ ...prev, [teamId]: updatedMembers }));
          setTeamInputs((prev) => ({ ...prev, [teamId]: "" }));
          await fetchTeams();
        } else {
          // Fallback to fetch members if response doesn't include them
          await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
          const membersResponse = await axios.get(`${apiUrl}/api/Team/members/${teamId}`);
          const fallbackMembers = membersResponse.data || [];
          console.log("Fallback updated members:", fallbackMembers);
          if (fallbackMembers.some((member) => member.employeeId === parseInt(employeeId))) {
            setOperationStatus((prev) => ({
              ...prev,
              [teamId]: { success: `Employee ${employeeId} added`, loading: false, error: "" },
            }));
            setTeamMembers((prev) => ({ ...prev, [teamId]: fallbackMembers }));
            setTeamInputs((prev) => ({ ...prev, [teamId]: "" }));
            await fetchTeams();
          } else {
            throw new Error("Employee not found in updated members list. Backend may not have updated.");
          }
        }
      } else {
        throw new Error(`Unexpected status: ${response.status}`);
      }
    } catch (err) {
      console.error("Add employee error:", err.response ? err.response.data : err.message);
      setOperationStatus((prev) => ({
        ...prev,
        [teamId]: {
          error:
            err.response?.data?.message ||
            err.response?.statusText ||
            "Failed to add employee. Check server logs or ensure the employee ID and team ID are valid.",
          loading: false,
          success: "",
        },
      }));
    }
  };

  const handleRemoveEmployee = async (teamId) => {
    const employeeId = teamInputs[teamId];
    if (!employeeId) {
      setOperationStatus((prev) => ({
        ...prev,
        [teamId]: { error: "Enter an employee ID", loading: false, success: "" },
      }));
      return;
    }

    setOperationStatus((prev) => ({ ...prev, [teamId]: { loading: true, error: "", success: "" } }));

    try {
      const payload = { teamId, employeeId: parseInt(employeeId) };
      const response = await axios.delete(`${apiUrl}/api/Team/removeMember`, { data: payload });
      if (response.status === 200) {
        setOperationStatus((prev) => ({
          ...prev,
          [teamId]: { success: `Employee ${employeeId} removed`, loading: false, error: "" },
        }));
        const membersResponse = await axios.get(`${apiUrl}/api/Team/members/${teamId}`);
        setTeamMembers((prev) => ({ ...prev, [teamId]: membersResponse.data || [] }));
        setTeamInputs((prev) => ({ ...prev, [teamId]: "" }));
        await fetchTeams();
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err) {
      console.error("Remove employee error:", err);
      setOperationStatus((prev) => ({
        ...prev,
        [teamId]: {
          error: err.response?.data?.message || "Failed to remove employee",
          loading: false,
          success: "",
        },
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center" style={{ backgroundColor: themeColors.light }}>
          <h3 className="text-lg font-semibold" style={{ color: themeColors.primary }}>
            Manage Teams
          </h3>
          <button onClick={() => setShowTeamsModal(false)} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 flex-grow overflow-y-auto">
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1">Search Teams</label>
            <div className="relative">
              <svg className="absolute left-2 top-2 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by team name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1 border rounded text-sm"
                style={{ borderColor: "#e2e8f0" }}
              />
            </div>
          </div>

          {filteredTeams.length === 0 ? (
            <div className="text-center py-2 text-gray-500 text-sm">No teams found</div>
          ) : (
            <div className="overflow-x-auto max-h-[50vh]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 sticky top-0">
                    <th className="p-2 text-left font-medium" style={{ color: themeColors.primary }}>
                      Team
                    </th>
                    <th className="p-2 text-left font-medium" style={{ color: themeColors.primary }}>
                      Description
                    </th>
                    <th className="p-2 text-left font-medium" style={{ color: themeColors.primary }}>
                      Members
                    </th>
                    <th className="p-2 text-left font-medium" style={{ color: themeColors.primary }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.map((team) => (
                    <tr key={team.teamId} className="border-b hover:bg-gray-50">
                      <td className="p-2" style={{ color: themeColors.primary }}>
                        {team.teamName}
                      </td>
                      <td className="p-2 max-w-xs">{team.description || "N/A"}</td>
                      <td className="p-2">
                        {teamMembers[team.teamId]?.length ? (
                          <ul className="list-disc pl-4">
                            {teamMembers[team.teamId].map((member) => (
                              <li key={member.employeeId} className="mb-1">
                                {member.username || member.name} (ID: {member.employeeId})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-500">No members</span>
                        )}
                      </td>
                      <td className="p-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-1 items-center">
                            <input
                              type="number"
                              placeholder="ID"
                              value={teamInputs[team.teamId] || ""}
                              onChange={(e) => handleInputChange(team.teamId, e.target.value)}
                              className="w-20 px-1 py-1 border rounded text-xs"
                              disabled={operationStatus[team.teamId]?.loading}
                            />
                            <button
                              onClick={() => handleAddEmployee(team.teamId)}
                              disabled={operationStatus[team.teamId]?.loading}
                              className="px-2 py-1 rounded text-white text-xs"
                              style={{ backgroundColor: themeColors.success }}
                            >
                              {operationStatus[team.teamId]?.loading ? "Adding..." : "Add"}
                            </button>
                            <button
                              onClick={() => handleRemoveEmployee(team.teamId)}
                              disabled={operationStatus[team.teamId]?.loading}
                              className="px-2 py-1 rounded text-white text-xs"
                              style={{ backgroundColor: themeColors.danger }}
                            >
                              {operationStatus[team.teamId]?.loading ? "Removing..." : "Remove"}
                            </button>
                          </div>
                          {operationStatus[team.teamId]?.success && (
                            <span className="text-green-600">{operationStatus[team.teamId].success}</span>
                          )}
                          {operationStatus[team.teamId]?.error && (
                            <span className="text-red-600">{operationStatus[team.teamId].error}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamsModal;