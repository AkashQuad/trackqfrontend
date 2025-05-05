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


const NoTasksView = ({ showActiveTasks, showOverdueTasks, taskFilterType, userRole, onAddTask }) => (
    <div className="bg-white border border-gray-200 rounded-md p-6 flex flex-col items-center justify-center h-64">
      <ListTodo className="h-12 w-12 text-gray-300 mb-2" />
      <h3 className="text-xl font-medium text-gray-700 mb-1">No tasks found</h3>
      <p className="text-gray-500 mb-4">
        {showActiveTasks
          ? "No active tasks at the moment."
          : showOverdueTasks
          ? "No overdue tasks at the moment."
          : taskFilterType === "assigned"
          ? "No assigned tasks."
          : "No tasks available."}
      </p>
      {(taskFilterType !== "assigned" || userRole === "manager") && (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          onClick={onAddTask}
        >
          <Plus className="h-5 w-5 mr-1" /> Create a new task
        </button>
      )}
    </div>
  );
  export default NoTasksView;