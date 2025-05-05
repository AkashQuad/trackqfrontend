import React from "react";
import axios from "axios";
import { apiUrl } from "../../config";

const CreateTeamModal = ({
  showCreateTeamModal,
  setShowCreateTeamModal,
  employeeTasks,
  userId,
  themeColors,
  fetchEmployeeTasks,
}) => {
  const [teamForm, setTeamForm] = React.useState({
    teamName: "",
    description: "",
    employeeIds: [],
  });
  const [employeeSearchQuery, setEmployeeSearchQuery] = React.useState("");
  const [filteredModalEmployees, setFilteredModalEmployees] = React.useState([]);
  const [createLoading, setCreateLoading] = React.useState(false);
  const [createSuccess, setCreateSuccess] = React.useState(false);
  const [createError, setCreateError] = React.useState("");

  // Filter employees based on search
  React.useEffect(() => {
    if (employeeSearchQuery.trim() === "") {
      setFilteredModalEmployees(employeeTasks);
    } else {
      const filtered = employeeTasks.filter((employee) =>
        employee.username.toLowerCase().includes(employeeSearchQuery.toLowerCase())
      );
      setFilteredModalEmployees(filtered);
    }
  }, [employeeSearchQuery, employeeTasks]);

  const handleTeamFormChange = (e) => {
    const { name, value } = e.target;
    setTeamForm({ ...teamForm, [name]: value });
  };

  const handleEmployeeCheckboxChange = (employeeId) => {
    const updatedEmployeeIds = [...teamForm.employeeIds];
    if (updatedEmployeeIds.includes(employeeId)) {
      const index = updatedEmployeeIds.indexOf(employeeId);
      updatedEmployeeIds.splice(index, 1);
    } else {
      updatedEmployeeIds.push(employeeId);
    }
    setTeamForm({ ...teamForm, employeeIds: updatedEmployeeIds });
  };

  const handleCreateTeam = (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");
    setCreateSuccess(false);

    if (!teamForm.teamName || teamForm.employeeIds.length === 0) {
      setCreateError("Please provide a team name and select at least one employee");
      setCreateLoading(false);
      return;
    }

    const teamData = {
      teamName: teamForm.teamName,
      description: teamForm.description,
      managerId: parseInt(userId),
      memberIds: teamForm.employeeIds
    };

    axios
      .post(`${apiUrl}/api/Team/create`, teamData)
      .then((response) => {
        setCreateSuccess(true);
        setTeamForm({ teamName: "", description: "", employeeIds: [] });
        alert(`Team "${teamForm.teamName}" created successfully with ID: ${response.data.teamId}`);
        setShowCreateTeamModal(false);
        fetchEmployeeTasks(new Date()); // Refresh tasks
      })
      .catch((err) => {
        setCreateError(err.response?.data?.message || "Failed to create team. Please try again.");
        console.error("Error creating team:", err);
      })
      .finally(() => setCreateLoading(false));
  };

  return (
    showCreateTeamModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b" style={{ backgroundColor: themeColors.light }}>
            <h3 className="text-xl font-semibold" style={{ color: themeColors.primary }}>
              Create New Team
            </h3>
          </div>

          <form onSubmit={handleCreateTeam} className="p-6">
            {createSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700">
                Team created successfully!
              </div>
            )}
            {createError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700">
                {createError}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Team Name</label>
              <input
                type="text"
                name="teamName"
                value={teamForm.teamName}
                onChange={handleTeamFormChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: "#e2e8f0" }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={teamForm.description}
                onChange={handleTeamFormChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: "#e2e8f0" }}
                placeholder="Describe the purpose and goals of this team..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Select Team Members</label>
              <div className="relative mb-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={employeeSearchQuery}
                  onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300"
                  style={{ borderColor: "#e2e8f0" }}
                />
              </div>
              <div className="max-h-40 overflow-y-auto border rounded-lg p-3">
                {filteredModalEmployees.length > 0 ? (
                  filteredModalEmployees.map((employee) => (
                    <div key={employee.employeeId} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`employee-${employee.employeeId}`}
                        checked={teamForm.employeeIds.includes(employee.employeeId)}
                        onChange={() => handleEmployeeCheckboxChange(employee.employeeId)}
                        className="h-4 w-4 text-purple-600"
                      />
                      <label htmlFor={`employee-${employee.employeeId}`} className="ml-2 text-sm">
                        {employee.username}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-2 text-gray-500">
                    No employees found matching "{employeeSearchQuery}"
                  </div>
                )}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {teamForm.employeeIds.length} member(s) selected
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowCreateTeamModal(false)}
                className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="px-6 py-2 rounded-lg text-white font-medium flex items-center"
                style={{ backgroundColor: themeColors.primary }}
              >
                {createLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating...
                  </>
                ) : (
                  "Create Team"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CreateTeamModal;