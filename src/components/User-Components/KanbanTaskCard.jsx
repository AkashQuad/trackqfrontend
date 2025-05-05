import { useState } from "react";
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


  const KanbanTaskCard = ({ task, onDragStart, userRole, onEdit, onDelete, onUpdateStatus, onLogHours, onViewHistory, onComplete }) => {
    const STATUS_CONFIG = {
      "Not Started": {
        color: "bg-slate-100",
        borderColor: "border-slate-300",
      },
      "In Progress": {
        color: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      "Completed": {
        color: "bg-emerald-50",
        borderColor: "border-emerald-200",
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
    
  
    const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG["Not Started"];
    const priorityClass = getPriorityColor(task.priority);
    const isAssigned = task.assignedBy || task.isAssigned;
    const canEdit = !isAssigned || userRole === "manager";
    const [showDetails, setShowDetails] = useState(false);
  
    return (
      
      <div
        className={`border rounded-md p-3 mb-3 ${statusConfig.color} ${statusConfig.borderColor} cursor-pointer hover:shadow-md transition-shadow`}
        draggable
        onDragStart={() => onDragStart(task)}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="font-medium text-gray-800">{task.topic}</div>
            {task.subTopic && <div className="text-sm text-gray-500">{task.subTopic}</div>}
          </div>
          <span className={`px-2 py-1 text-xs rounded-full border ${priorityClass}`}>
            {getPriorityLabel(task.priority)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>
              Est: {task.expectedHours || 0}h
              {task.completedHours > 0 && ` / Done: ${task.completedHours}h`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{formatDate(task.endDate)}</span>

          </div>
        </div>
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            {task.description && <p className="text-sm text-gray-600 mb-2">{task.description}</p>}
            <div className="text-sm text-gray-600 mb-2">
              <strong>Due Date:</strong> {formatDate(task.endDate)}
            </div>
            <div className="flex gap-2 flex-wrap">
              {task.status === "Not Started" && (
                <button
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(task.taskId, "In Progress");
                  }}
                >
                  Start Task
                </button>
              )}
              {task.status !== "Completed" && (
                <button
                  className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete(task);
                  }}
                >
                  Mark Completed
                </button>
              )}
              {task.status !== "Not Started" && task.status !== "Completed" &&(
              <button
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onLogHours(task);
                }}
              >
                Log Daily Hours
              </button>
               )}
              <button
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewHistory(task);
                }}
              >
                Check Daily Hours
              </button>
              {canEdit && task.status !== "Completed" &&(
                <>
                  <button
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task);
                    }}
                  >
                    Edit
                  </button>
                  {task.status !== "Completed" &&(
                  <button
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.taskId);
                    }}
                  >
                    Delete
                  </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  

  export default KanbanTaskCard;