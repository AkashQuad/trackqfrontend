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

  const KanbanView = ({
    groupedTasks,
    handleDragStart,
    handleDragOver,
    handleDrop,
    userRole,
    onEdit,
    onDelete,
    onUpdateStatus,
    onLogHours,
    onViewHistory,
    onComplete,
  }) => {
    const STATUS_CONFIG = {
      "Not Started": {
        order: 1,
        color: "bg-slate-100",
        borderColor: "border-slate-300",
        textColor: "text-slate-700",
        icon: <CircleDashed className="h-5 w-5" />,
      },
      "In Progress": {
        order: 2,
        color: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        icon: <Loader2 className="h-5 w-5" />,
      },
      "Completed": {
        order: 3,
        color: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        icon: <CheckCircle2 className="h-5 w-5" />,
      },
    };
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(groupedTasks).map(([status, tasks]) => {
          const statusConfig = STATUS_CONFIG[status];
          return (
            <div
              key={status}
              className={`bg-white border ${statusConfig.borderColor} rounded-md shadow-sm`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div
                className={`p-3 ${statusConfig.color} border-b ${statusConfig.borderColor} flex items-center justify-between`}
              >
                <h2 className={`font-medium ${statusConfig.textColor} flex items-center`}>
                  {statusConfig.icon}
                  <span className="ml-2">{status}</span>
                  <span className="ml-2 text-sm text-gray-500">({tasks.length})</span>
                </h2>
              </div>
              <div className="p-3 max-h-[calc(100vh-240px)] overflow-y-auto">
                {tasks.map((task) => (
                  <KanbanTaskCard
                    key={task.taskId}
                    task={task}
                    onDragStart={handleDragStart}
                    userRole={userRole}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onUpdateStatus={onUpdateStatus}
                    onLogHours={onLogHours}
                    onViewHistory={onViewHistory}
                    onComplete={onComplete}
                  />
                ))}
                {tasks.length === 0 && (
                  <div className="text-center p-4 text-gray-400 italic text-sm">No tasks in this column</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
export default KanbanView;  