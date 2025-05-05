import { format, isSameDay, isBefore, isAfter, parseISO, isValid } from "date-fns";

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
import KanbanTaskCard from "./KanbanTaskCard";
import GridView from "./GridView";


const TableTaskCard = ({ task, userRole, onEdit, onLogHours, onViewHistory, onComplete, onUpdateStatus, onDelete }) => {
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
      "Completed": {
        color: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        icon: <CheckCircle2 className="h-5 w-5" />,
      },
    };
  
    const getPriorityLabel = (priority) => {
      if (priority === null || priority === undefined) return "No Priority";
      if (priority >= 0 && priority <= 3) return "High";
      if (priority >= 4 && priority <= 7) return "Medium";
      return "Low";
    };
  
    const getPriorityColor = (priority) => {
      if (priority === null || priority === undefined) return "text-gray-600 bg-gray-50 border-gray-200";
      if (priority >= 0 && priority <= 3) return "text-red-600 bg-red-50 border-red-200";
      if (priority >= 4 && priority <= 7) return "text-orange-600 bg-orange-50 border-orange-200";
      return "text-green-600 bg-green-50 border-green-200";
    };
  
    const formatDate = (dateString) => {
        if (!dateString) return "No Due Date";
        try {
          // Debug input
          console.log(`formatDate input: ${dateString}`);
          // Normalize the date string
          const cleanedDateString = dateString.trim();
          // Parse as ISO 8601
          let date = parseISO(cleanedDateString);
          if (isValid(date)) {
            return format(date, "MMM d, yyyy");
          }
          // Fallback: Try parsing date-only
          const dateOnlyString = cleanedDateString.split("T")[0];
          date = parseISO(dateOnlyString);
          if (isValid(date)) {
            return format(date, "MMM d, yyyy");
          }
          console.warn(`Invalid date format for: ${cleanedDateString}`);
          return "Invalid Date";
        } catch (error) {
          console.error(`Error parsing date: ${dateString}`, error);
          return "Invalid Date";
        }
      };
    
  
    const statusConfig =
      task.status in STATUS_CONFIG
        ? STATUS_CONFIG[task.status]
        : {
            color: "bg-red-50",
            borderColor: "border-red-200",
            textColor: "text-red-700",
            icon: <AlertTriangle className="h-5 w-5" />,
          };
    const priorityClass = getPriorityColor(task.priority);
    const isAssigned = task.assignedBy || task.isAssigned;
    const canEdit = !isAssigned || userRole === "manager";
  
    return (
        
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3">
          <div className="flex flex-col">
            <div className="font-medium text-gray-800">{task.topic}</div>
            {task.subTopic && <div className="text-sm text-gray-500">{task.subTopic}</div>}
            {task.description && <div className="text-sm text-gray-600 mt-1">{task.description}</div>}
          </div>
        </td>
        <td className="px-4 py-3">
          <span
            className={`px-2 py-1 text-xs rounded-full flex items-center ${statusConfig.color} ${statusConfig.textColor} border ${statusConfig.borderColor}`}
          >
            {statusConfig.icon}
            <span className="ml-1">{task.status}</span>
          </span>
        </td>
        <td className="px-4 py-3">
          <span className={`px-2 py-1 text-xs rounded-full border ${priorityClass}`}>
            {getPriorityLabel(task.priority)}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-col">
            <span>Est: {task.expectedHours || 0}h</span>
            {task.completedHours > 0 && <span className="text-emerald-600">Done: {task.completedHours}h</span>}
          </div>
        </td>
        <td className="px-4 py-3">{formatDate(task.endDate)}</td>
        <td className="px-4 py-3">
          <div className="flex space-x-2">
            {task.status!=="Completed" &&(
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => onEdit(task)}
                title="Edit"
              >
                <Pencil className="h-4 w-4 text-blue-500" />
              </button>
            )}
            {task.status!=="Completed" &&(
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => onLogHours(task)}
              title="Log Daily Hours"
            >
              <Timer className="h-4 w-4 text-gray-500" />
            </button>
            )}
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => onViewHistory(task)}
              title="Check Daily Hours"
            >
              <History className="h-4 w-4 text-gray-500" />
            </button>
            {task.status !== "Completed"  && task.status !=="Not Started" &&(
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => onComplete(task)}
                title="Mark Complete"
              >
                <Check className="h-4 w-4 text-emerald-500" />
              </button>
            )}
            {(task.status === "Not Started" || task.status === "Overdue") && (
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => onUpdateStatus(task.taskId, "In Progress")}
                title="Start Task"
              >
                <Loader2 className="h-4 w-4 text-blue-500" />
              </button>
            )}
            {task.status!=="Completed" &&(
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => onDelete(task.taskId)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            )}
           
          </div>
        </td>
      </tr>
      
    );
  };
  export default TableTaskCard;