import React from "react";
import { User, Plus, RefreshCw, Users } from "lucide-react";
import NotificationButton from "./NotificationButton";

const TaskHeader = ({ user, userName, onAddTask, taskFilterType, userRole, onRefresh, tasksNeedingHours, onLogHours, onViewTeam }) => (
  <div className="mb-6 flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
      {user && (
        <div className="mt-2 flex items-center text-sm text-slate-500">
          <User className="h-4 w-4 mr-1" />
          <span className="font-bold">{user.name || userName}</span>
        </div>
      )}
    </div>
    <div className="flex items-center gap-2">
      <NotificationButton tasks={tasksNeedingHours} onLogHours={onLogHours} />
      <button className="text-blue-600 hover:text-blue-800 p-2" onClick={onRefresh} title="Refresh Tasks">
        <RefreshCw className="h-5 w-5" />
      </button>
      <button className="text-blue-600 hover:text-blue-800 p-2" onClick={onViewTeam} title="View Team">
        <Users className="h-5 w-5" />
      </button>
      {(taskFilterType !== "assigned" || userRole === "manager") && (
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center"
          onClick={onAddTask}
        >
          <Plus className="h-5 w-5 mr-1" /> New Task
        </button>
      )}
    </div>
  </div>
);

export default TaskHeader;