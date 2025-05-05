import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { format, isSameDay, isBefore, isAfter, parseISO, isValid } from "date-fns";
import { apiUrl } from "../../config";
import AddTaskForm from "./AddTaskForm";
import TaskHeader from "./TaskHeader";
import TaskFilters from "./TaskFilters";
import UpdateHoursModal from "./UpdateHoursModal";
import GridView from "./GridView";
import KanbanView from "./KanbanView";
import DailyHoursHistoryModal from "./DailyHoursHistoryModal";
import NoTasksView from "./NoTasksView";
import TeamModal from "./TeamModal"; // Import the new TeamModal
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  ListTodo,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Pencil,
  CircleDashed,
  LayoutGrid,
  Columns,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  XCircle,
  Check,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  Timer,
  History,
  Bell,
} from "lucide-react";

const TaskCalendar = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOverdueLoading, setActiveOverdueLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeOverdueError, setActiveOverdueError] = useState("");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("user");
  const [refreshMessage, setRefreshMessage] = useState("");
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [hoursSpent, setHoursSpent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [taskFilterType, setTaskFilterType] = useState("all");
  const [currentView, setCurrentView] = useState("kanban");
  const [sortField, setSortField] = useState("priority");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showActiveTasks, setShowActiveTasks] = useState(false);
  const [showOverdueTasks, setShowOverdueTasks] = useState(false);
  const [kanbanDate, setKanbanDate] = useState("");
  const [gridDate, setGridDate] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [tasksNeedingHours, setTasksNeedingHours] = useState([]);
  const [lastHoursUpdate, setLastHoursUpdate] = useState(() => {
    const stored = localStorage.getItem("lastHoursUpdate");
    return stored ? JSON.parse(stored) : {};
  });
  const [isDailyHoursHistoryModalOpen, setIsDailyHoursHistoryModalOpen] = useState(false);
  const [dailyHoursHistory, setDailyHoursHistory] = useState([]);
  const [historyTask, setHistoryTask] = useState(null);
  // New states for team modal
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState("");

  const UserName = localStorage.getItem("UserName");

  // Save lastHoursUpdate to localStorage
  useEffect(() => {
    localStorage.setItem("lastHoursUpdate", JSON.stringify(lastHoursUpdate));
  }, [lastHoursUpdate]);

  // Clean up old lastHoursUpdate entries
  useEffect(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    setLastHoursUpdate((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((taskId) => {
        if (updated[taskId] !== today) {
          delete updated[taskId];
        }
      });
      localStorage.setItem("lastHoursUpdate", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Fetch team data
  const fetchTeamData = async (userId) => {
    try {
      setTeamLoading(true);
      setTeamError("");
      const response = await axios.get(`${apiUrl}/api/Team/employee/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setTeams(response.data || []);
    } catch (err) {
      console.error("Error fetching team data:", err);
      setTeamError(err.response?.status === 404 ? "No teams found." : "Failed to load team data.");
      setTeams([]);
    } finally {
      setTeamLoading(false);
    }
  };

  // Handle View Team button click
  const handleViewTeam = () => {
    if (employeeId) {
      fetchTeamData(employeeId);
      setIsTeamModalOpen(true);
    } else {
      setTeamError("No employee ID found. Please log in.");
    }
  };

  // Fetch all tasks
  const fetchAllTasks = async (userId) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${apiUrl}/api/Tasks/employee/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const tasks = (response.data || []).map((task) => ({
        ...task,
        status: task.status === "Pending" ? "Not Started" : task.status,
        endDate: task.endDate || null,
      }));
      console.log("TaskCalendar: Fetched all tasks:", tasks); // Debug log
      setAllTasks(tasks);
    } catch (err) {
      console.error("TaskCalendar: Error fetching all tasks:", err);
      setError("Failed to load tasks.");
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return "No Due Date";
    try {
      let date;
      if (dateInput instanceof Date && isValid(dateInput)) {
        date = dateInput;
      } else if (typeof dateInput === "string") {
        const cleanedDateString = dateInput.trim();
        date = parseISO(cleanedDateString);
        if (!isValid(date)) {
          const dateOnlyString = cleanedDateString.split("T")[0];
          date = parseISO(dateOnlyString);
        }
      } else {
        console.warn(`Invalid date input type: ${typeof dateInput}`);
        return "Invalid Date";
      }
      if (isValid(date)) {
        return format(date, "MMM d, yyyy");
      }
      console.warn(`Invalid date format for: ${dateInput}`);
      return "Invalid Date";
    } catch (error) {
      console.error(`Error parsing date: ${dateInput}`, error);
      return "Invalid Date";
    }
  };

  // Fetch active tasks
  const fetchActiveTasks = async (userId) => {
    try {
      setActiveOverdueLoading(true);
      setActiveOverdueError("");
      const response = await axios.get(`${apiUrl}/api/tasks/status/active?employeeId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const tasks = (response.data || []).map((task) => ({
        ...task,
        status: task.status === "Pending" ? "Not Started" : task.status,
        endDate: task.endDate || null,
      }));
      setActiveTasks(tasks);
    } catch (err) {
      console.error("Error fetching active tasks:", err);
      setActiveOverdueError("Failed to load active tasks.");
      setActiveTasks([]);
    } finally {
      setActiveOverdueLoading(false);
    }
  };

  // Fetch overdue tasks
  const fetchOverdueTasks = async (userId) => {
    try {
      setActiveOverdueLoading(true);
      setActiveOverdueError("");
      const response = await axios.get(`${apiUrl}/api/Tasks/status/overdue?employeeId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const tasks = (response.data || []).map((task) => ({
        ...task,
        status: task.status === "Pending" ? "Not Started" : task.status,
        endDate: task.endDate || null,
      }));
      setOverdueTasks(tasks);
    } catch (err) {
      console.error("Error fetching overdue tasks:", err);
      setActiveOverdueError("Failed to load overdue tasks.");
      setOverdueTasks([]);
    } finally {
      setActiveOverdueLoading(false);
    }
  };

  // Fetch private tasks
  const fetchPrivateEmployeeTasks = async (userId) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${apiUrl}/api/Tasks/employee/${userId}/private`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const tasks = (response.data || []).map((task) => ({
        ...task,
        status: task.status === "Pending" ? "Not Started" : task.status,
        endDate: task.endDate || null,
      }));
      setAllTasks(tasks);
    } catch (err) {
      console.error("Error fetching private tasks:", err);
      setError(err.response?.status === 404 ? "No private tasks found." : "Failed to load private tasks.");
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch assigned tasks
  const fetchAssignedEmployeeTasks = async (userId) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${apiUrl}/api/Tasks/employee/${userId}/assigned`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const tasks = (response.data || []).map((task) => ({
        ...task,
        status: task.status === "Pending" ? "Not Started" : task.status,
        endDate: task.endDate || null,
        isAssigned: true,
      }));
      setAllTasks(tasks);
    } catch (err) {
      console.error("Error fetching assigned tasks:", err);
      setError(err.response?.status === 404 ? "No assigned tasks found." : "Failed to load assigned tasks.");
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks by date
  const fetchTasksByDate = async (userId, date) => {
    try {
      setLoading(true);
      setError("");
      let endpoint;
      if (taskFilterType === "private") {
        endpoint = `${apiUrl}/api/Tasks/employee/${userId}/private`;
      } else if (taskFilterType === "assigned") {
        endpoint = `${apiUrl}/api/Tasks/employee/${userId}/assigned`;
      } else {
        endpoint = `${apiUrl}/api/Tasks/details`;
      }

      const formattedDate = date && isValid(parseISO(date)) ? format(parseISO(date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const params = taskFilterType === "all" ? { dateQ: formattedDate, employeeId: userId } : {};

      const response = await axios.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      let tasksData = response.data || [];
      if (date && taskFilterType !== "all") {
        tasksData = tasksData.filter((task) => {
          const taskDate = new Date(task.date || task.endDate);
          const filterDate = new Date(date);
          return taskDate.toDateString() === filterDate.toDateString();
        });
      }

      const tasks = tasksData.map((task) => ({
        ...task,
        taskId: task.taskId || `temp-${Math.random()}`,
        status: task.status === "Pending" ? "Not Started" : task.status,
      }));
      setAllTasks(tasks);
    } catch (err) {
      console.error("Error fetching tasks by date:", err);
      setError(err.response?.status === 404 ? "No tasks found for this date." : `Failed to load tasks: ${err.message}`);
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data
  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setUser(response.data);
      setUserRole(response.data.userRole || "user");
    } catch (err) {
      console.error("Error fetching user data:", err);
      setUser({ name: "User" });
    }
  };

  // Fetch daily hours history
  const fetchDailyHoursHistory = async (taskId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/tasks/${taskId}/daily-hours`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setDailyHoursHistory(response.data || []);
    } catch (err) {
      console.error("Error fetching daily hours:", err);
      alert(err.response?.status === 404 ? "Task not found." : "Failed to load daily hours.");
      setDailyHoursHistory([]);
    }
  };

  // Calculate total completed hours from daily logs
  const calculateCompletedHours = async (taskId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/tasks/${taskId}/daily-hours`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const dailyHours = response.data || [];
      const totalHours = dailyHours.reduce((sum, entry) => sum + parseFloat(entry.hoursSpent || 0), 0);
      return totalHours;
    } catch (err) {
      console.error("Error calculating completed hours:", err);
      return 0;
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const taskToUpdate = [...allTasks, ...activeTasks, ...overdueTasks].find((t) => t.taskId === taskId);
      if (!taskToUpdate) return;

      let completedHours = taskToUpdate.completedHours || 0;
      if (newStatus === "Completed") {
        completedHours = await calculateCompletedHours(taskId);
      }

      const updatedTask = {
        ...taskToUpdate,
        status: newStatus,
        completedHours,
      };

      await axios.put(`${apiUrl}/api/Tasks/${taskId}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      setAllTasks((prev) =>
        prev.map((task) =>
          task.taskId === taskId ? { ...task, status: newStatus, completedHours } : task
        )
      );
      setActiveTasks((prev) =>
        prev.map((task) =>
          task.taskId === taskId ? { ...task, status: newStatus, completedHours } : task
        )
      );
      setOverdueTasks((prev) =>
        prev.map((task) =>
          task.taskId === taskId ? { ...task, status: newStatus, completedHours } : task
        )
      );

      if (showActiveTasks) fetchActiveTasks(employeeId);
      if (showOverdueTasks) fetchOverdueTasks(employeeId);
      if (!showActiveTasks && !showOverdueTasks) {
        if (showDateFilter) {
          fetchTasksByDate(employeeId, currentView === "kanban" ? kanbanDate : gridDate);
        } else {
          fetchTasksByFilterType(employeeId, taskFilterType);
        }
      }

      setRefreshMessage(`Task moved to ${newStatus} successfully`);
      setTimeout(() => setRefreshMessage(""), 300);
      checkTasksNeedingHours();
    } catch (err) {
      console.error("Error updating task status:", err);
      alert("Failed to update task status.");
    }
  };

  const handleComplete = async (task) => {
    await updateTaskStatus(task.taskId, "Completed");
  };

  // Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${apiUrl}/api/Tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setAllTasks((prev) => prev.filter((task) => task.taskId !== taskId));
      setActiveTasks((prev) => prev.filter((task) => task.taskId !== taskId));
      setOverdueTasks((prev) => prev.filter((task) => task.taskId !== taskId));
      setTasksNeedingHours((prev) => prev.filter((task) => task.taskId !== taskId));
      setLastHoursUpdate((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        localStorage.setItem("lastHoursUpdate", JSON.stringify(updated));
        return updated;
      });
      setRefreshMessage("Task deleted successfully");
      setTimeout(() => setRefreshMessage(""), 300);
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task.");
    }
  };

  // Update daily hours
  const updateDailyHours = async (taskId, hours) => {
    if (!taskId) {
      console.error("Task ID is undefined");
      alert("Cannot log hours: Invalid task ID.");
      return;
    }
    try {
      await axios.post(
        `${apiUrl}/api/tasks/${taskId}/hours`,
        { hoursSpent: parseFloat(hours) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRefreshMessage("Daily hours logged successfully");
      setTimeout(() => setRefreshMessage(""), 300);
      if (showActiveTasks) fetchActiveTasks(employeeId);
      if (showOverdueTasks) fetchOverdueTasks(employeeId);
      if (!showActiveTasks && !showOverdueTasks) {
        if (showDateFilter) {
          fetchTasksByDate(employeeId, currentView === "kanban" ? kanbanDate : gridDate);
        } else {
          fetchTasksByFilterType(employeeId, taskFilterType);
        }
      }
      setLastHoursUpdate((prev) => {
        const updated = {
          ...prev,
          [taskId]: format(new Date(), "yyyy-MM-dd"),
        };
        localStorage.setItem("lastHoursUpdate", JSON.stringify(updated));
        return updated;
      });
      setTasksNeedingHours((prev) => prev.filter((task) => task.taskId !== taskId));
      setSelectedTask(null);
      setIsHoursModalOpen(false);
    } catch (err) {
      console.error("Error updating daily hours:", err);
      alert("Failed to log daily hours.");
    }
  };

  // Manual refresh
  const handleManualRefresh = () => {
    if (employeeId) {
      if (showActiveTasks) {
        fetchActiveTasks(employeeId);
      } else if (showOverdueTasks) {
        fetchOverdueTasks(employeeId);
      } else if (showDateFilter) {
        fetchTasksByDate(employeeId, currentView === "kanban" ? kanbanDate : gridDate);
      } else {
        fetchTasksByFilterType(employeeId, taskFilterType);
      }
      setRefreshMessage("Tasks refreshed");
      setTimeout(() => setRefreshMessage(""), 300);
      checkTasksNeedingHours();
    }
  };

  // Check tasks needing daily hours
  const checkTasksNeedingHours = useCallback(() => {
    if (!employeeId) return;

    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    const hours = now.getHours();
    const isWithinNotificationWindow = hours >= 9 && hours < 18;

    const eligibleTasks = allTasks.filter((task) => {
      const taskStartDate = task.date ? parseISO(task.date) : null;
      const taskEndDate = task.endDate ? parseISO(task.endDate) : null;
      const isEligibleStatus = task.status === "Not Started" || task.status === "In Progress";
      const isDateValid =
        (!taskStartDate || isBefore(taskStartDate, now) || isSameDay(taskStartDate, now)) &&
        (!taskEndDate || isAfter(taskEndDate, now) || isSameDay(taskEndDate, now));
      const lastUpdateDate = lastHoursUpdate[task.taskId];
      const hasHoursLoggedToday = lastUpdateDate && lastUpdateDate === today;
      return isEligibleStatus && isDateValid && !hasHoursLoggedToday;
    });

    const tasksToNotify = isWithinNotificationWindow ? eligibleTasks : [];
    setTasksNeedingHours(tasksToNotify);
  }, [allTasks, employeeId, lastHoursUpdate]);

  useEffect(() => {
    checkTasksNeedingHours();
  }, [checkTasksNeedingHours, lastHoursUpdate]);

  // Fetch tasks by filter type
  const fetchTasksByFilterType = (userId, filterType) => {
    setCurrentPage(1);
    console.log("TaskCalendar: Fetching tasks for filterType:", filterType, "userId:", userId); // Debug log
    if (filterType === "private") {
      fetchPrivateEmployeeTasks(userId);
    } else if (filterType === "assigned") {
      fetchAssignedEmployeeTasks(userId);
    } else {
      fetchAllTasks(userId);
    }
  };

  // Initial load
  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("userId") || "2002";
    setEmployeeId(storedEmployeeId);
    fetchTasksByFilterType(storedEmployeeId, taskFilterType);
    fetchUserData(storedEmployeeId);
    checkTasksNeedingHours();
  }, []);

  // Handle filter type changes
  useEffect(() => {
    if (!employeeId) return;
    setCurrentPage(1);
    setShowDateFilter(false);
    setKanbanDate("");
    setGridDate("");
    fetchTasksByFilterType(employeeId, taskFilterType);
  }, [taskFilterType, employeeId]);

  // Handle date filter changes
  useEffect(() => {
    if (!employeeId || showActiveTasks || showOverdueTasks) return;
    if (showDateFilter && (kanbanDate || gridDate)) {
      fetchTasksByDate(employeeId, currentView === "kanban" ? kanbanDate : gridDate);
    }
  }, [kanbanDate, gridDate, currentView, employeeId, showDateFilter, showActiveTasks, showOverdueTasks]);

  // Autorefresh at 5:30 PM daily
  useEffect(() => {
    if (!employeeId || showActiveTasks || showOverdueTasks) return;

    const scheduleRefresh = () => {
      const now = new Date();
      const refreshTime = new Date();
      refreshTime.setHours(17, 30, 0, 0);

      if (now > refreshTime) {
        refreshTime.setDate(refreshTime.getDate() + 1);
      }

      const timeUntilRefresh = refreshTime - now;

      const timeout = setTimeout(() => {
        handleManualRefresh();
        scheduleRefresh();
      }, timeUntilRefresh);

      return () => clearTimeout(timeout);
    };

    scheduleRefresh();

    return () => {};
  }, [employeeId, showActiveTasks, showOverdueTasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    console.log("TaskCalendar: Computing filteredTasks:", {
      allTasks: allTasks.length,
      activeTasks: activeTasks.length,
      overdueTasks: overdueTasks.length,
      statusFilter,
      showActiveTasks,
      showOverdueTasks,
      searchTerm,
      sortField,
      sortDirection,
    });
    let result = showActiveTasks ? activeTasks : showOverdueTasks ? overdueTasks : allTasks;
    console.log("TaskCalendar: Initial result length:", result.length); // Debug log
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (task) =>
          task.topic?.toLowerCase().includes(searchLower) ||
          (task.subTopic && task.subTopic.toLowerCase().includes(searchLower)) ||
          (task.description && task.description.toLowerCase().includes(searchLower))
      );
      console.log("TaskCalendar: After search filter:", result.length); // Debug log
    }
    if (!showActiveTasks && !showOverdueTasks && statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
      console.log("TaskCalendar: After status filter:", result.length, "Status:", statusFilter); // Debug log
    }
    const sortedResult = result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      if (sortField === "date" || sortField === "endDate") {
        fieldA = new Date(fieldA || "9999-12-31");
        fieldB = new Date(fieldB || "9999-12-31");
      } else if (typeof fieldA === "string") {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }
      return sortDirection === "asc" ? (fieldA > fieldB ? 1 : -1) : (fieldA < fieldB ? 1 : -1);
    });
    console.log("TaskCalendar: Final filteredTasks length:", sortedResult.length); // Debug log
    return sortedResult;
  }, [allTasks, activeTasks, overdueTasks, sortField, sortDirection, searchTerm, statusFilter, showActiveTasks, showOverdueTasks]);

  // Grouped tasks for Kanban
  const groupedTasks = useMemo(() => {
    const statusOrder = ["Not Started", "In Progress", "Completed"];
    return statusOrder.reduce((acc, status) => {
      acc[status] = filteredTasks.filter((task) => task.status === status).sort((a, b) => a.priority - b.priority);
      return acc;
    }, {});
  }, [filteredTasks]);

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  // Task actions
  const openAddTaskModal = () => {
    setTaskToEdit(null);
    setIsAddTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setIsAddTaskModalOpen(true);
  };

  const handleTaskCreated = (newTask) => {
    setAllTasks((prev) => [...prev, newTask]);
    setIsAddTaskModalOpen(false);
    setRefreshMessage("Task created successfully");
    setTimeout(() => setRefreshMessage(""), 300);
    if (showActiveTasks && newTask.status === "In Progress") {
      setActiveTasks((prev) => [...prev, newTask]);
    }
    if (showOverdueTasks && newTask.endDate && new Date(newTask.endDate) < new Date() && newTask.status !== "Completed") {
      setOverdueTasks((prev) => [...prev, newTask]);
    }
    checkTasksNeedingHours();
  };

  const handleTaskUpdated = (updatedTask) => {
    setAllTasks((prev) => prev.map((task) => (task.taskId === updatedTask.taskId ? updatedTask : task)));
    setActiveTasks((prev) => prev.map((task) => (task.taskId === updatedTask.taskId ? updatedTask : task)));
    setOverdueTasks((prev) => prev.map((task) => (task.taskId === updatedTask.taskId ? updatedTask : task)));
    setIsAddTaskModalOpen(false);
    setTaskToEdit(null);
    setRefreshMessage("Task updated successfully");
    setTimeout(() => setRefreshMessage(""), 300);
    if (showActiveTasks) fetchActiveTasks(employeeId);
    if (showOverdueTasks) fetchOverdueTasks(employeeId);
    checkTasksNeedingHours();
  };

  
  // Hours modals
  const openUpdateHoursModal = (task) => {
    if (!task || !task.taskId) {
      console.error("Invalid task or taskId:", task);
      console.error("Invalid task or taskId:", JSON.stringify(task));
      alert("Cannot open hours modal: Invalid task.");
      return;
    }
    setSelectedTask(task);
    setHoursSpent("");
    
    setRefreshMessage("Task updated successfully");
    setTimeout(() => setRefreshMessage(""), 300);

    setIsHoursModalOpen(true);
  };


  // Refetch tasks when statusFilter changes
useEffect(() => {
  if (!employeeId || showActiveTasks || showOverdueTasks) return;
  console.log("TaskCalendar: Status filter changed to:", statusFilter, "Refetching tasks for filterType:", taskFilterType);
  fetchTasksByFilterType(employeeId, taskFilterType);
}, [statusFilter, employeeId, taskFilterType, showActiveTasks, showOverdueTasks]);

  // Drag-and-drop
  const handleDragStart = (task) => {
    if (task.status !== "Completed") {
      setSelectedTask(task);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (selectedTask) {
      if (!selectedTask.taskId) {
        console.error("Selected task has no taskId:", selectedTask);
        alert("Cannot update task: Invalid task ID.");
        return;
      }

      updateTaskStatus(selectedTask.taskId, status);
      const startDate = selectedTask.date ? formatDate(selectedTask.date) : null;
      const endDate = selectedTask.endDate ? formatDate(selectedTask.endDate) : null;
      if (startDate && endDate && startDate === endDate && status === "Completed") {
        openUpdateHoursModal(selectedTask);
      } else {
        setSelectedTask(null);
      }
      checkTasksNeedingHours();
    }
  };


  const closeUpdateHoursModal = () => {
    setIsHoursModalOpen(false);
    setSelectedTask(null);
    setHoursSpent("");
  };

  const openDailyHoursHistoryModal = (task) => {
    setHistoryTask(task);
    fetchDailyHoursHistory(task.taskId);
    setIsDailyHoursHistoryModalOpen(true);
  };

  // Sort toggle
  const toggleSort = (field) => {
    setSortField(field);
    setSortDirection(sortField === field && sortDirection === "asc" ? "desc" : "asc");
  };

  // Render
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <TaskHeader
        user={user}
        userName={UserName}
        onAddTask={openAddTaskModal}
        taskFilterType={taskFilterType}
        userRole={userRole}
        onRefresh={handleManualRefresh}
        tasksNeedingHours={tasksNeedingHours}
        onLogHours={openUpdateHoursModal}
        onViewTeam={handleViewTeam}
      />
      <TaskFilters
        currentView={currentView}
        setCurrentView={setCurrentView}
        taskFilterType={taskFilterType}
        setTaskFilterType={setTaskFilterType}
        showActiveTasks={showActiveTasks}
        setShowActiveTasks={setShowActiveTasks}
        showOverdueTasks={showOverdueTasks}
        setShowOverdueTasks={setShowOverdueTasks}
        kanbanDate={kanbanDate}
        gridDate={gridDate}
        setKanbanDate={setKanbanDate}
        setGridDate={setGridDate}
        showDateFilter={showDateFilter}
        setShowDateFilter={setShowDateFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        employeeId={employeeId}
        fetchTasksByDate={fetchTasksByDate}
        fetchTasksByFilterType={fetchTasksByFilterType}
        fetchActiveTasks={fetchActiveTasks}
        fetchOverdueTasks={fetchOverdueTasks}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      {refreshMessage && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-3">
          <span className="text-blue-700">{refreshMessage}</span>
        </div>
      )}
      {(loading || activeOverdueLoading) && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading tasks...</span>
        </div>
      )}
      {(error || activeOverdueError) && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-700">{error || activeOverdueError}</p>
          <button
            onClick={handleManualRefresh}
            className="mt-2 px-4 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      )}
      {!(loading || activeOverdueLoading) && !error && !activeOverdueError && currentView === "kanban" && (
        <KanbanView
          groupedTasks={groupedTasks}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          userRole={userRole}
          onEdit={openEditTaskModal}
          onDelete={handleDelete}
          onUpdateStatus={updateTaskStatus}
          onLogHours={openUpdateHoursModal}
          onViewHistory={openDailyHoursHistoryModal}
          onComplete={handleComplete}
        />
      )}
      {!(loading || activeOverdueLoading) && !error && !activeOverdueError && currentView === "grid" && (
        <GridView
          filteredTasks={filteredTasks}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalPages={totalPages}
          sortField={sortField}
          sortDirection={sortDirection}
          toggleSort={toggleSort}
          showActiveTasks={showActiveTasks}
          showOverdueTasks={showOverdueTasks}
          userRole={userRole}
          onEdit={openEditTaskModal}
          onDelete={handleDelete}
          onUpdateStatus={updateTaskStatus}
          onLogHours={openUpdateHoursModal}
          onViewHistory={openDailyHoursHistoryModal}
          onComplete={handleComplete}
        />
      )}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{taskToEdit ? "Edit Task" : "Add New Task"}</h2>
              <button
                onClick={() => {
                  setIsAddTaskModalOpen(false);
                  setTaskToEdit(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <AddTaskForm
              onTaskCreated={handleTaskCreated}
              onTaskUpdated={handleTaskUpdated}
              existingTask={taskToEdit}
              employeeId={employeeId}
              onClose={() => {
                setIsAddTaskModalOpen(false);
                setTaskToEdit(null);
              }}
            />
          </div>
        </div>
      )}
      <UpdateHoursModal
        isOpen={isHoursModalOpen}
        onClose={closeUpdateHoursModal}
        onSubmit={updateDailyHours}
        task={selectedTask || {}}
      />
      <DailyHoursHistoryModal
        isOpen={isDailyHoursHistoryModalOpen}
        onClose={() => {
          setIsDailyHoursHistoryModalOpen(false);
          setHistoryTask(null);
          setDailyHoursHistory([]);
        }}
        hours={dailyHoursHistory}
        task={historyTask || {}}
      />
      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        teams={teams}
        loading={teamLoading}
        error={teamError}
      />
    </div>
  );
}
export default TaskCalendar;