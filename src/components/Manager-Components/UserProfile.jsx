import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config";
import EmployeeTaskList from "./EmployeeTaskList";
import StatsCards from "./StatsCards";
import StatusModal from "./StatusModal";
import Pagination from "./Pagination";
import AssignTaskModal from "./AssignTaskModal";
import TaskControls from "./TaskControls";
import CreateTeamModal from "./CreateTeamModal";
import TeamsModal from "./TeamsModal";

const UserProfile = () => {
  const { userId } = useParams();
  const location = useLocation();
  const userName = location.state?.username || "Unknown";

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [employeeTasks, setEmployeeTasks] = useState([]);
  const [filteredEmployeeTasks, setFilteredEmployeeTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage, setEmployeesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    totalTeams: 0,
  });
  const [statusFilter, setStatusFilter] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showTotalEmployeesTable, setShowTotalEmployeesTable] = useState(false);
  const [assignTaskForm, setAssignTaskForm] = useState({
    employeeIds: [],
    teamIds: [],
    topic: "",
    subTopic: "",
    description: "",
    expectedHours: 0,
    priority: 1,
    startDate: formatDateForInput(new Date()),
    endDate: formatDateForInput(new Date()),
    status: "Not Started",
  });
  const [teams, setTeams] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [assignError, setAssignError] = useState("");

  const themeColors = {
    primary: "#9F7AEA", // soft-purple
    secondary: "#FB923C", // muted-orange
    accent: "#FC9D9A", // peach
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    neutral: "#F9FAFB", // neutral-50
    textDark: "#4A4A4A", // text-color
    textMuted: "#6B7280",
  };

  useEffect(() => {
    fetchEmployeeTasks(selectedDate);
    fetchTeams();
  }, [userId, selectedDate]);

  useEffect(() => {
    let filtered = [...employeeTasks];
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((employee) =>
        employee.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter && statusFilter !== "total" && statusFilter !== "teams") {
      filtered = filtered.map((employee) => ({
        ...employee,
        tasks: employee.tasks.filter((task) => task.status.toLowerCase() === statusFilter.toLowerCase()),
      }));
    }
    setFilteredEmployeeTasks(filtered);
    setTotalPages(Math.max(1, Math.ceil(filtered.length / employeesPerPage)));
  }, [searchQuery, employeeTasks, employeesPerPage, statusFilter, teams]);

  useEffect(() => {
    calculateStats(employeeTasks);
  }, [employeeTasks]);

  const calculateStats = (employees) => {
    let totalTasks = 0;
    let completedTasks = 0;
    let inProgressTasks = 0;
    let pendingTasks = 0;
    employees.forEach((employee) => {
      totalTasks += employee.tasks.length;
      employee.tasks.forEach((task) => {
        if (task.status.toLowerCase() === "completed") completedTasks++;
        else if (task.status.toLowerCase() === "in progress") inProgressTasks++;
        else pendingTasks++;
      });
    });
    setStats((prevStats) => ({
      ...prevStats,
      totalEmployees: employees.length,
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
    }));
    calculateTeamStats();
  };

  const calculateTeamStats = () => {
    setStats((prevStats) => ({
      ...prevStats,
      totalTeams: teams.length,
    }));
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/Team/manager/${userId}`);
      const teamsData = Array.isArray(response.data) ? response.data : [];
      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setTeams([]);
    }
  };

  const fetchEmployeeTasks = async (dateToFetch) => {
    if (!userId) {
      setError("No manager ID available");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const employeesResponse = await axios.get(`${apiUrl}/api/Manager/${userId}/employees`);
      const employees = employeesResponse.data;

      const taskPromises = employees.map((employee) =>
        axios
          .get(`${apiUrl}/api/Tasks/details`, {
            params: {
              dateQ: dateToFetch.toLocaleDateString("en-CA"),
              employeeId: employee.employeeId,
            },
          })
          .catch((err) => ({ data: [] }))
      );

      const [taskResponses, teamsResponse] = await Promise.all([
        Promise.all(taskPromises),
        axios.get(`${apiUrl}/api/Team/manager/${userId}`).catch(() => ({ data: [] })),
      ]);

      const teamsData = Array.isArray(teamsResponse.data) ? teamsResponse.data : [];
      setTeams(teamsData);

      const employeesWithTasks = employees.map((employee, index) => ({
        ...employee,
        tasks: taskResponses[index].data || [],
      }));

      setEmployeeTasks(employeesWithTasks);
      setTotalPages(Math.max(1, Math.ceil(employeesWithTasks.length / employeesPerPage)));
    } catch (err) {
      console.error("Error fetching employees or tasks:", err);
      setError("Failed to load employee tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEmployeesPerPageChange = (e) => {
    setEmployeesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleStatusCardClick = (statusType) => {
    if (statusFilter === statusType) {
      setStatusFilter(null);
      setShowStatusModal(false);
      setShowTeamsModal(false);
      setShowTotalEmployeesTable(false);
    } else {
      setStatusFilter(statusType);
      if (statusType === "total") {
        setShowStatusModal(false);
        setShowTeamsModal(false);
        setShowTotalEmployeesTable(true);
      } else if (statusType === "teams") {
        setShowStatusModal(false);
        setShowTeamsModal(true);
        setShowTotalEmployeesTable(false);
      } else {
        setShowStatusModal(true);
        setShowTeamsModal(false);
        setShowTotalEmployeesTable(false);
      }
    }
    setCurrentPage(1);
  };

  function formatDateForInput(date) {
    return date.toISOString().split("T")[0];
  }

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployeeTasks.slice(indexOfFirstEmployee, indexOfLastEmployee);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-3xl font-semibold text-text-color">Hello</h1>
          <p className="text-sm text-neutral-600 mt-2">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Controls */}
        <TaskControls
          selectedDate={selectedDate}
          formatDateForInput={formatDateForInput}
          handleDateChange={(e) => {
            setSelectedDate(new Date(e.target.value));
            setCurrentPage(1);
          }}
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          employeesPerPage={employeesPerPage}
          handleEmployeesPerPageChange={handleEmployeesPerPageChange}
          themeColors={themeColors}
          setShowAssignModal={setShowAssignModal}
          setShowCreateTeamModal={setShowCreateTeamModal}
        />

        {/* Stats Cards */}
        <StatsCards
          stats={stats}
          themeColors={themeColors}
          statusFilter={statusFilter}
          handleStatusCardClick={handleStatusCardClick}
        />

        {/* Conditional Content */}
        {showStatusModal && statusFilter && statusFilter !== "total" && statusFilter !== "teams" && (
          <StatusModal
            statusFilter={statusFilter}
            themeColors={themeColors}
            filteredEmployeeTasks={filteredEmployeeTasks}
            setShowStatusModal={setShowStatusModal}
          />
        )}

        {showTeamsModal && statusFilter === "teams" && (
          <TeamsModal
            teams={teams}
            setShowTeamsModal={setShowTeamsModal}
            themeColors={themeColors}
            userId={userId}
            employeeTasks={employeeTasks}
            fetchTeams={fetchTeams}
          />
        )}

        {showTotalEmployeesTable && statusFilter === "total" && (
          <div className="card mt-8 animate-slide-up">
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-header">
                    <th className="p-4 text-left">Employee</th>
                    <th className="p-4 text-left">Total Tasks</th>
                    <th className="p-4 text-left">Status Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployeeTasks.map((employee) => (
                    <tr key={employee.employeeId} className="table-row">
                      <td className="p-4 text-text-color">{employee.username}</td>
                      <td className="p-4 text-text-color">{employee.tasks.length}</td>
                      <td className="p-4 text-neutral-600">
                        {Object.entries(
                          employee.tasks.reduce(
                            (acc, task) => {
                              acc[task.status] = (acc[task.status] || 0) + 1;
                              return acc;
                            },
                            { Completed: 0, "In Progress": 0, "Not Started": 0 }
                          )
                        )
                          .map(([status, count]) => `${count} ${status}`)
                          .join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              indexOfFirstEmployee={indexOfFirstEmployee}
              indexOfLastEmployee={indexOfLastEmployee}
              filteredEmployeeTasks={filteredEmployeeTasks}
            />
          </div>
        )}

        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-soft-purple"></div>
          </div>
        )}

        {error && (
          <div className="card p-4 mb-8 bg-danger/5 text-danger animate-fade-in">
            {error}
          </div>
        )}

        {!loading && filteredEmployeeTasks.length === 0 && !showTotalEmployeesTable && (
          <div className="card p-6 text-center mb-8 animate-fade-in">
            <p className="text-neutral-600">
              {searchQuery
                ? `No employees found matching "${searchQuery}"`
                : statusFilter && statusFilter !== "teams"
                ? `No ${statusFilter} tasks found for this date`
                : "No tasks found for this date"}
            </p>
          </div>
        )}

        {!showTotalEmployeesTable && statusFilter !== "total" && statusFilter !== "teams" && (
          <EmployeeTaskList
            currentEmployees={currentEmployees}
            themeColors={themeColors}
            statusFilter={statusFilter}
            allEmployees={employeeTasks}
          />
        )}

        {statusFilter !== "total" && statusFilter !== "teams" && filteredEmployeeTasks.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            indexOfFirstEmployee={indexOfFirstEmployee}
            indexOfLastEmployee={indexOfLastEmployee}
            filteredEmployeeTasks={filteredEmployeeTasks}
          />
        )}

        {showAssignModal && (
          <AssignTaskModal
            setShowAssignModal={setShowAssignModal}
            assignTaskForm={assignTaskForm}
            setAssignTaskForm={setAssignTaskForm}
            assignLoading={assignLoading}
            assignSuccess={assignSuccess}
            assignError={assignError}
            setAssignLoading={setAssignLoading}
            setAssignSuccess={setAssignSuccess}
            setAssignError={setAssignError}
            themeColors={themeColors}
            employeeTasks={employeeTasks}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            fetchEmployeeTasks={fetchEmployeeTasks}
            userId={userId}
            teams={teams}
          />
        )}

        {showCreateTeamModal && (
          <CreateTeamModal
            showCreateTeamModal={showCreateTeamModal}
            setShowCreateTeamModal={setShowCreateTeamModal}
            employeeTasks={employeeTasks}
            userId={userId}
            themeColors={themeColors}
            fetchEmployeeTasks={fetchEmployeeTasks}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;