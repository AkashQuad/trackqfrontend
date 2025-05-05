import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Trash2, CheckSquare, Square, Search, Filter, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, AlertCircle, RefreshCw, Pencil, RotateCcw,
  Edit2Icon,
  FilterIcon,
  Edit
} from "lucide-react";
import { apiUrl } from "../../config";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [deletedEmployees, setDeletedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const [managers, setManagers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // "active" or "deleted"
  const roleMapping = { User: 1, Manager: 2, Admin: 3 };
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [processingAction, setProcessingAction] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, activeTab]);

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, debouncedSearchQuery, refreshTrigger, activeTab]);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    setSelectedEmployees(new Set());
    setProcessingAction("");
    setError(null);
    setSelectedRole("");
    setSelectedManager("");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        activeTab === "active" ? fetchEmployees() : fetchDeletedEmployees(),
        fetchManagers(),
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/Admin/employees`, {
        params: {
          page: currentPage,
          pageSize: itemsPerPage,
          searchQuery: debouncedSearchQuery,
        },
      });
      const empData = response.data.employees || [];
      const updatedEmployees = empData.map((emp) => ({
        ...emp,
        role: Object.keys(roleMapping).find((key) => roleMapping[key] === emp.roleID) || "User",
      }));
      setEmployees(updatedEmployees);
      setTotalItems(response.data.totalCount);
      setTotalPages(response.data.pageCount);
      return updatedEmployees;
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError(error.message);
      throw error;
    }
  };

  const fetchDeletedEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/Admin/deleted-employees`, {
        params: {
          page: currentPage,
          pageSize: itemsPerPage,
          searchQuery: debouncedSearchQuery,
        },
      });
      const empData = response.data.employees || [];
      const updatedEmployees = empData.map((emp) => ({
        ...emp,
        role: Object.keys(roleMapping).find((key) => roleMapping[key] === emp.roleID) || "User",
      }));
      setDeletedEmployees(updatedEmployees);
      setTotalItems(response.data.totalCount);
      setTotalPages(response.data.pageCount);
      return updatedEmployees;
    } catch (error) {
      console.error("Error fetching deleted employees:", error);
      setError(error.message);
      throw error;
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/Admin/get-managers`);
      let managerData = Array.isArray(response.data) ? response.data : response.data.managers || [];
      setManagers(managerData);
      return managerData;
    } catch (error) {
      console.error("Error fetching managers:", error);
      setManagers([]);
      return [];
    }
  };

  const toggleSelectEmployee = (empId) => {
    setSelectedEmployees((prev) => {
      const newSelection = new Set(prev);
      newSelection.has(empId) ? newSelection.delete(empId) : newSelection.add(empId);
      return newSelection;
    });
  };

  const toggleSelectAll = () => {
    const currentEmployees = activeTab === "active" ? employees : deletedEmployees;
    if (selectedEmployees.size === currentEmployees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(currentEmployees.map((emp) => emp.employeeId)));
    }
  };

  const handleSoftDelete = (empId) => {
    setConfirmAction("soft-delete");
    setConfirmData({ id: empId });
    setShowConfirmDialog(true);
  };

  const handleHardDelete = (empId) => {
    setConfirmAction("hard-delete");
    setConfirmData({ id: empId });
    setShowConfirmDialog(true);
  };

  const handleBatchSoftDelete = () => {
    if (selectedEmployees.size === 0) return;
    setConfirmAction("batch-soft-delete");
    setConfirmData({ batch: true, count: selectedEmployees.size });
    setShowConfirmDialog(true);
  };

  const handleBatchHardDelete = () => {
    if (selectedEmployees.size === 0) return;
    setConfirmAction("batch-hard-delete");
    setConfirmData({ batch: true, count: selectedEmployees.size });
    setShowConfirmDialog(true);
  };

  const handleRestore = (empId) => {
    setConfirmAction("restore");
    setConfirmData({ id: empId });
    setShowConfirmDialog(true);
  };

  const handleBatchRestore = () => {
    if (selectedEmployees.size === 0) return;
    setConfirmAction("batch-restore");
    setConfirmData({ batch: true, count: selectedEmployees.size });
    setShowConfirmDialog(true);
  };

  const handleEdit = (employee) => {
    setEditEmployee({
      employeeId: employee.employeeId,
      username: employee.username,
      email: employee.email,
      roleID: roleMapping[employee.role],
      managerId: employee.managerId || null,
    });
    setIsEditing(true);
  };

  const handleConfirmedSoftDelete = async (empId) => {
    try {
      setProcessingAction(`soft-delete-${empId}`);
      await axios.delete(`${apiUrl}/api/Admin/delete-employee/${empId}`);
      triggerRefresh();
    } catch (error) {
      console.error(" Delete Error:", error.response?.data || error.message);
      setError("Failed to  delete employee. Please try again.");
    } finally {
      setProcessingAction("");
    }
  };

  const handleConfirmedHardDelete = async (empId) => {
    try {
      setProcessingAction(`hard-delete-${empId}`);
      await axios.delete(`${apiUrl}/api/Admin/hard-delete-employee/${empId}`);
      triggerRefresh();
    } catch (error) {
      console.error(" Delete Error:", error.response?.data || error.message);
      setError("Failed to delete employee. Please try again.");
    } finally {
      setProcessingAction("");
    }
  };

  const handleConfirmedBatchSoftDelete = async () => {
    try {
      const employeeIds = Array.from(selectedEmployees);
      setProcessingAction("batch-soft-delete");
      await axios.post(`${apiUrl}/api/Admin/batch-delete-employees`, employeeIds, {
        headers: { "Content-Type": "application/json", Accept: "*/*" },
      });
      triggerRefresh();
    } catch (error) {
      console.error("Batch Delete Error:", error.response?.data || error.message);
      setError("Failed to delete employees. Please try again.");
    } finally {
      setProcessingAction("");
    }
  };

  const handleConfirmedBatchHardDelete = async () => {
    try {
      const employeeIds = Array.from(selectedEmployees);
      setProcessingAction("batch-hard-delete");
      await axios.post(`${apiUrl}/api/Admin/batch-hard-delete-employees`, employeeIds, {
        headers: { "Content-Type": "application/json", Accept: "*/*" },
      });
      triggerRefresh();
    } catch (error) {
      console.error("Batch  Delete Error:", error.response?.data || error.message);
      setError("Failed to  delete employees. Please try again.");
    } finally {
      setProcessingAction("");
    }
  };

  const handleConfirmedRestore = async (empId) => {
    try {
      setProcessingAction(`restore-${empId}`);
      await axios.put(`${apiUrl}/api/Admin/restore-employee/${empId}`);
      triggerRefresh();
    } catch (error) {
      console.error("Restore Error:", error.response?.data || error.message);
      setError("Failed to restore employee. Please try again.");
    } finally {
      setProcessingAction("");
    }
  };

  const handleConfirmedBatchRestore = async () => {
    try {
      const employeeIds = Array.from(selectedEmployees);
      setProcessingAction("batch-restore");
      await axios.post(`${apiUrl}/api/Admin/batch-restore-employees`, employeeIds, {
        headers: { "Content-Type": "application/json", Accept: "*/*" },
      });
      triggerRefresh();
    } catch (error) {
      console.error("Batch Restore Error:", error.response?.data || error.message);
      setError("Failed to restore employees. Please try again.");
    } finally {
      setProcessingAction("");
    }
  };

  const handleEditSubmit = async () => {
    try {
      setProcessingAction(`edit-${editEmployee.employeeId}`);
      await axios.put(`${apiUrl}/api/Admin/edit-employee/${editEmployee.employeeId}`, {
        username: editEmployee.username,
        email: editEmployee.email,
        roleId: editEmployee.roleID,
        managerId: editEmployee.managerId,
      });
      setIsEditing(false);
      setEditEmployee(null);
      triggerRefresh();
    } catch (error) {
      console.error("Edit Error:", error.response?.data || error.message);
      setError("Failed to update employee. Please try again.");
    } finally {
      setProcessingAction("");
    }
  };

  const batchUpdateRole = async () => {
    if (!selectedRole || selectedEmployees.size === 0) return;
    try {
      const requestData = Array.from(selectedEmployees).map((empId) => ({
        employeeId: empId,
        roleId: roleMapping[selectedRole],
      }));
      setProcessingAction("batch-role");
      await axios.put(`${apiUrl}/api/Admin/batch-update-roles`, requestData, {
        headers: { "Content-Type": "application/json", Accept: "*/*" },
      });
      setSelectedRole("");

    setRefreshTrigger((prev) => prev + 1);
    setProcessingAction("");
    } catch (error) {
      console.error("Batch Update Role Error:", error.response?.data || error.message);
      setError("Failed to update roles. Please try again.");
      setProcessingAction("");
    }
  };

  const batchChangeManager = async () => {
    if (!selectedManager || selectedEmployees.size === 0) return;
    try {
      const requestData = Array.from(selectedEmployees).map((empId) => ({
        employeeId: empId,
        managerId: selectedManager === "null" ? null : Number(selectedManager),
      }));
      setProcessingAction("batch-manager");
      await axios.put(`${apiUrl}/api/Admin/batch-update-managers`, requestData, {
        headers: { "Content-Type": "application/json", Accept: "*/*" },
      });
      setSelectedManager("");
      
      setRefreshTrigger((prev) => prev + 1);
      setProcessingAction("");
    } catch (error) {
      console.error("Batch Update Manager Error:", error.response?.data || error.message);
      setError("Failed to update managers. Please try again.");
      setProcessingAction("");
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800";
      case "Manager":
        return "bg-blue-100 text-blue-800";
        case "User":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && employees.length === 0 && deletedEmployees.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("active")}
              className={`${
                activeTab === "active"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Active Employees
            </button>
            <button
              onClick={() => setActiveTab("deleted")}
              className={`${
                activeTab === "deleted"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Deleted Employees
            </button>
          </nav>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start">
          <AlertCircle size={20} className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-red-700">{error}</div>
          <button
            onClick={() => setError(null)}
            className="ml-3 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Search and Filters Area */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={triggerRefresh}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Refresh data"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
              title="Toggle actions"
            >
              <Edit size={18} />
            </button>
          </div>
        </div>

        {/* Batch Actions & Filters */}
        {showFilters && (
          <div className="p-5 bg-white rounded-lg mb-4 border border-gray-200 shadow-sm animate-fadeIn">
            <h3 className="font-medium text-gray-800 mb-4 flex items-center">
              <Edit size={16} className="mr-2 text-gray-500" />
              Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeTab === "active" ? (
                <>
                  <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Delete Employees</h4>
                    <button
                      onClick={handleBatchSoftDelete}
                      disabled={selectedEmployees.size === 0 || processingAction === "batch-soft-delete"}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm transition-colors ${
                        selectedEmployees.size === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      <Trash2 size={16} className="mr-1.5" />
                      <span>{processingAction === "batch-soft-delete" ? "Soft Deleting..." : " Delete Selected"}</span>
                    </button>
                  </div>
                  <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Update Roles</h4>
                    <div className="flex items-center">
                      <select
                        onChange={(e) => setSelectedRole(e.target.value)}
                        value={selectedRole}
                        disabled={selectedEmployees.size === 0 || processingAction === "batch-role"}
                        className={`border rounded-l-lg px-3 py-2 text-sm w-2/3 ${
                          selectedEmployees.size === 0
                            ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
                            : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      >
                        <option value="">Select Role</option>
                        {Object.keys(roleMapping).map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={batchUpdateRole}
                        disabled={!selectedRole || selectedEmployees.size === 0 || processingAction === "batch-role"}
                        className={`px-4 py-2 rounded-r-lg text-sm border border-l-0 w-1/3 ${
                          !selectedRole || selectedEmployees.size === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                            : "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                        }`}
                      >
                        {processingAction === "batch-role" ? "Apply" : "Apply"}
                      </button>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Assign Managers</h4>
                    <div className="flex items-center">
                      <select
                        onChange={(e) => setSelectedManager(e.target.value)}
                        value={selectedManager}
                        disabled={selectedEmployees.size === 0 || processingAction === "batch-manager"}
                        className={`border rounded-l-lg px-3 py-2 text-sm w-2/3 ${
                          selectedEmployees.size === 0
                            ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
                            : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      >
                        <option value="">Select Manager</option>
                        <option value="null">No Manager</option>
                        {managers.map((manager) => (
                          <option key={manager.id} value={manager.id}>
                            {manager.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={batchChangeManager}
                        disabled={!selectedManager || selectedEmployees.size === 0 || processingAction === "batch-manager"}
                        className={`px-4 py-2 rounded-r-lg text-sm border border-l-0 w-1/3 ${
                          !selectedManager || selectedEmployees.size === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                            : "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                        }`}
                      >
                        {processingAction === "batch-manager" ? "Apply" : "Apply"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Restore Employees</h4>
                    <button
                      onClick={handleBatchRestore}
                      disabled={selectedEmployees.size === 0 || processingAction === "batch-restore"}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm transition-colors ${
                        selectedEmployees.size === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      <RotateCcw size={16} className="mr-1.5" />
                      <span>{processingAction === "batch-restore" ? "Restoring..." : "Restore Selected"}</span>
                    </button>
                  </div>
                  <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Permanently Delete Employees</h4>
                    <button
                      onClick={handleBatchHardDelete}
                      disabled={selectedEmployees.size === 0 || processingAction === "batch-hard-delete"}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm transition-colors ${
                        selectedEmployees.size === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-800 text-white hover:bg-red-900"
                      }`}
                    >
                      <Trash2 size={16} className="mr-1.5" />
                      <span>{processingAction === "batch-hard-delete" ? "Deleting..." : "Delete Selected"}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left" onClick={toggleSelectAll}>
                  <div className="flex items-center cursor-pointer">
                    {selectedEmployees.size === (activeTab === "active" ? employees : deletedEmployees).length &&
                    (activeTab === "active" ? employees : deletedEmployees).length > 0 ? (
                      <CheckSquare size={18} className="text-blue-600" />
                    ) : (
                      <Square size={18} className="text-gray-400" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Username</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Manager</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(activeTab === "active" ? employees : deletedEmployees).length > 0 ? (
                (activeTab === "active" ? employees : deletedEmployees).map((emp) => (
                  <tr key={emp.employeeId} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div
                        onClick={() => toggleSelectEmployee(emp.employeeId)}
                        className="cursor-pointer"
                      >
                        {selectedEmployees.has(emp.employeeId) ? (
                          <CheckSquare size={18} className="text-blue-600" />
                        ) : (
                          <Square size={18} className="text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{emp.employeeId}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{emp.username}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeStyle(emp.role)}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.managerName || "—"}</td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                      {activeTab === "active" ? (
                        <>
                          <button
                            onClick={() => handleEdit(emp)}
                            disabled={processingAction === `edit-${emp.employeeId}`}
                            className={`p-1 rounded-full hover:bg-blue-50 ${
                              processingAction === `edit-${emp.employeeId}`
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-blue-500 hover:text-blue-700"
                            }`}
                            title="Edit employee"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleSoftDelete(emp.employeeId)}
                            disabled={processingAction === `soft-delete-${emp.employeeId}`}
                            className={`p-1 rounded-full hover:bg-red-50 ${
                              processingAction === `soft-delete-${emp.employeeId}`
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-500 hover:text-red-700"
                            }`}
                            title="delete employee"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleRestore(emp.employeeId)}
                            disabled={processingAction === `restore-${emp.employeeId}`}
                            className={`p-1 rounded-full hover:bg-green-50 ${
                              processingAction === `restore-${emp.employeeId}`
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-green-500 hover:text-green-700"
                            }`}
                            title="Restore employee"
                          >
                            <RotateCcw size={18} />
                          </button>
                          <button
                            onClick={() => handleHardDelete(emp.employeeId)}
                            disabled={processingAction === `hard-delete-${emp.employeeId}`}
                            className={`p-1 rounded-full hover:bg-red-50 ${
                              processingAction === `hard-delete-${emp.employeeId}`
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-700 hover:text-red-900"
                            }`}
                            title="Permanently delete employee"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                    {debouncedSearchQuery
                      ? "No employees found matching your search criteria"
                      : activeTab === "active"
                      ? "No active employees found. Add employees to get started."
                      : "No deleted employees found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span>{" "}
                  of <span className="font-medium">{totalItems}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">First</span>
                    <ChevronsLeft size={18} />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + idx;
                    } else {
                      pageNumber = currentPage - 2 + idx;
                    }
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                          currentPage === pageNumber
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Last</span>
                    <ChevronsRight size={18} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Action</h3>
            <p className="text-gray-600 mb-4">
              {confirmAction === "soft-delete"
                ? "Are you sure you want to  delete this employee? They can be restored later."
                : confirmAction === "hard-delete"
                ? "Are you sure you want to permanently delete this employee? This action cannot be undone."
                : confirmAction === "batch-soft-delete"
                ? `Are you sure you want to  delete ${confirmData.count} selected employees? They can be restored later.`
                : confirmAction === "batch-hard-delete"
                ? `Are you sure you want to permanently delete ${confirmData.count} selected employees? This action cannot be undone.`
                : confirmAction === "restore"
                ? "Are you sure you want to restore this employee?"
                : confirmAction === "batch-restore"
                ? `Are you sure you want to restore ${confirmData.count} selected employees?`
                : "Are you sure you want to perform this action?"}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  if (confirmAction === "soft-delete") {
                    handleConfirmedSoftDelete(confirmData.id);
                  } else if (confirmAction === "hard-delete") {
                    handleConfirmedHardDelete(confirmData.id);
                  } else if (confirmAction === "batch-soft-delete") {
                    handleConfirmedBatchSoftDelete();
                  } else if (confirmAction === "batch-hard-delete") {
                    handleConfirmedBatchHardDelete();
                  } else if (confirmAction === "restore") {
                    handleConfirmedRestore(confirmData.id);
                  } else if (confirmAction === "batch-restore") {
                    handleConfirmedBatchRestore();
                  }
                }}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                  confirmAction.includes("hard")
                    ? "bg-red-800 hover:bg-red-900"
                    : confirmAction.includes("restore")
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Edit Employee</h2>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditEmployee(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  // xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={editEmployee.username}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, username: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editEmployee.email}
                  onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={editEmployee.roleID}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, roleID: Number(e.target.value) })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value={1}>User</option>
                  <option value={2}>Manager</option>
                  <option value={3}>Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager (optional)
                </label>
                <select
                  value={editEmployee.managerId || ""}
                  onChange={(e) =>
                    setEditEmployee({
                      ...editEmployee,
                      managerId: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No Manager</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleEditSubmit}
                disabled={
                  !editEmployee.username ||
                  !editEmployee.email ||
                  processingAction === `edit-${editEmployee.employeeId}`
                }
                className={`w-full py-2 rounded-lg transition-colors ${
                  !editEmployee.username ||
                  !editEmployee.email ||
                  processingAction === `edit-${editEmployee.employeeId}`
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                }`}
              >
                {processingAction === `edit-${editEmployee.employeeId}` ? "Updated" : "Update Employee"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;