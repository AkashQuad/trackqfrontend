import { useState } from "react";
import { Bell } from "lucide-react";

const NotificationButton = ({ tasks, onLogHours }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Check if within notification window (for display purposes)
  const now = new Date();
  const isWithinNotificationWindow = now.getHours() >= 9 && now.getHours() < 18;

  // Only show button if there are tasks and within time window
  if (tasks.length === 0 || !isWithinNotificationWindow) return null;

  return (
    <div className="relative">
      <button
        className="relative text-blue-600 hover:text-blue-800 p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {tasks.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {tasks.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-800">Pending Daily Hours</h3>
            <p className="text-xs text-gray-500">Notifications active: 9 AM - 6 PM</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {tasks.map((task) => (
              <div key={task.taskId} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{task.topic}</span>
                  <button
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    onClick={() => {
                      onLogHours(task);
                      setIsOpen(false); // Close dropdown after clicking
                    }}
                  >
                    Log Hours
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200">
            <button
              className="w-full text-sm text-gray-600 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;