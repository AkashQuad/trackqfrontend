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
import TableTaskCard from "./TableTaskCard";
import Pagination from "./Pagination";

const GridView = ({
  filteredTasks,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  totalPages,
  sortField,
  sortDirection,
  toggleSort,
  showActiveTasks,
  showOverdueTasks,
  userRole,
  setItemsPerPage,
  onEdit,
  onLogHours,
  onViewHistory,
  onComplete,
  onUpdateStatus,
  onDelete,
}) => {
  const STATUS_CONFIG = {
    "Not Started": {
      color: "bg-slate-100",
      borderColor: "border-slate-300",
      textColor: "text-slate-700",
      icon: <CircleDashed className="h-5 w-5" />,
    },
    "In Progress": {
      color: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      icon: <Loader2 className="h-5 w-5" />,
    },
    Completed: {
      color: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
  };

  // Check if no tasks are found
  const noTasksFound = filteredTasks.length === 0;

  // Debug log for filteredTasks
  console.log("GridView: Filtered tasks:", filteredTasks, "No tasks found:", noTasksFound);

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          {/* Status filter removed, now in TaskFilters */}
        </div>
      </div>
      {noTasksFound && (
        <div className="p-4 text-center text-gray-500">
          No tasks found. Try selecting a different status or adding a new task.
        </div>
      )}
      {!noTasksFound && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center" onClick={() => toggleSort("topic")}>
                    Task
                    {sortField === "topic" &&
                      (sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center" onClick={() => toggleSort("status")}>
                    Status
                    {sortField === "status" &&
                      (sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center" onClick={() => toggleSort("priority")}>
                    Priority
                    {sortField === "priority" &&
                      (sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center" onClick={() => toggleSort("expectedHours")}>
                    Hours
                    {sortField === "expectedHours" &&
                      (sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center" onClick={() => toggleSort("endDate")}>
                    Due Date
                    {sortField === "endDate" &&
                      (sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((task) => (
                  <TableTaskCard
                    key={task.taskId}
                    task={task}
                    userRole={userRole}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onUpdateStatus={onUpdateStatus}
                    onLogHours={onLogHours}
                    onViewHistory={onViewHistory}
                    onComplete={onComplete}
                  />
                ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={filteredTasks.length}
      />
    </div>
  );
};

export default GridView;