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


const DailyHoursHistoryModal = ({ isOpen, onClose, hours, task }) => {
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
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Daily Hours History for {task.topic}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          {hours.length === 0 ? (
            <p className="text-gray-500">No daily hours recorded for this task.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours Spent
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hours.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{formatDate(entry.date)}</td>
                      <td className="px-4 py-2">{entry.hoursSpent} hours</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  export default DailyHoursHistoryModal;