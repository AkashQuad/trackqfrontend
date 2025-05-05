import { useState } from "react";

const UpdateHoursModal = ({ isOpen, onClose, onSubmit, task }) => {
  const [hours, setHours] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task || !task.taskId) {
      alert("Invalid task. Please try again.");
      onClose();
      return;
    }
    if (hours && parseFloat(hours) > 0) {
      onSubmit(task.taskId, hours);
      // Defer onClose to updateDailyHours after successful submission
    } else {
      alert("Please enter valid hours.");
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">
          Log Daily Hours for {task.topic || "Task"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Hours Spent Today
            </label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="0.25"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateHoursModal;