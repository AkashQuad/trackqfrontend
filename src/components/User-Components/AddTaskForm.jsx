import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, differenceInDays, parseISO } from 'date-fns';
import { apiUrl } from "../../config";
 
const AddTaskForm = ({ onClose, onTaskCreated, onTaskUpdated, existingTask, employeeId, preselectedDate }) => {
  
  
  const [taskData, setTaskData] = useState({
    employeeId: employeeId || localStorage.getItem("userId") || "",
    topic: "",
    subTopic: "",
    description: "",
    totalHours: "",
    priority: 0,
    expectedHours: 0,
    completedHours: 0,
    date: preselectedDate || format(new Date(), 'yyyy-MM-dd'),
    startDate: preselectedDate || format(new Date(), 'yyyy-MM-dd'),
    endDate: preselectedDate || format(new Date(), 'yyyy-MM-dd'),  
    status: "Not Started",
  });
 
  const [errorMessage, setErrorMessage] = useState("");
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
 
  useEffect(() => {
    const { startDate, endDate } = taskData;
    if (startDate && endDate) {
      try {
        const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
        const calculatedHours = days * 8;
        
        setTaskData(prevData => ({
          ...prevData,
          totalHours: calculatedHours.toString()
        }));
      } catch (error) {
        console.error("Error calculating hours:", error);
      }
    }
  }, [taskData.startDate, taskData.endDate]);
 
  useEffect(() => {
    console.log("existingTask received:", existingTask);
    
    if (existingTask) {
      try {
        const safeTask = { ...existingTask };
        
        const formatSafeDate = (dateString) => {
          if (!dateString) return format(new Date(), 'yyyy-MM-dd');
          try {
            return format(new Date(dateString), 'yyyy-MM-dd');
          } catch (e) {
            console.error("Date parsing error:", e);
            return format(new Date(), 'yyyy-MM-dd');
          }
        };
        
        setTaskData({
          taskId: safeTask.taskId,
          employeeId: employeeId || safeTask.employeeId || localStorage.getItem("userId") || "",
          topic: safeTask.topic || "",
          subTopic: safeTask.subTopic || "",
          description: safeTask.description || "",
          totalHours: safeTask.totalHours || "",
          priority: Number(safeTask.priority) || 0,
          expectedHours: Number(safeTask.expectedHours) || 0,
          completedHours: Number(safeTask.completedHours) || 0,
          date: formatSafeDate(safeTask.date),
          startDate: formatSafeDate(safeTask.startDate),
          endDate: formatSafeDate(safeTask.endDate),
          status: safeTask.status || "Not Started"
        });
        
        console.log("Task data set successfully");
      } catch (error) {
        console.error("Error setting task data:", error);
      }
    }
  }, [existingTask, employeeId]);
 
  const validateDates = () => {
    const start = new Date(taskData.startDate);
    const end = new Date(taskData.endDate);
   
    if (start > end) {
      setErrorMessage("Start date cannot be later than end date");
      return false;
    }
   
    setErrorMessage("");
    return true;
  };
 
  const handleClear = () => {
    setTaskData({
      employeeId: employeeId || localStorage.getItem("userId") || "",
      topic: "",
      subTopic: "",
      description: "",
      totalHours: "",
      priority: 0,
      expectedHours: 0,
      completedHours: 0,
      date: preselectedDate || format(new Date(), 'yyyy-MM-dd'),
      startDate: preselectedDate || format(new Date(), 'yyyy-MM-dd'),
      endDate: preselectedDate || format(new Date(), 'yyyy-MM-dd'),  
      status: "Not Started",
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!validateDates()) {
      return;
    }
 
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      };
 
      const submissionData = {
        ...taskData,
        employeeId: Number(taskData.employeeId) || Number(localStorage.getItem("userId")),
        priority: Number(taskData.priority),
        expectedHours: Number(taskData.expectedHours),
        completedHours: Number(taskData.completedHours),
        date: taskData.startDate, 
        startDate: taskData.startDate,
        endDate: taskData.endDate
      };
 
      let response;
      if (existingTask) {
        response = await axios.put(
          `${apiUrl}/api/tasks/${taskData.taskId}`,
          submissionData,
          { headers }
        );
        console.log("Task updated:", response.data);
        
        if (typeof onTaskUpdated === 'function') {
          onTaskUpdated(response.data);
        } else if (typeof onClose === 'function') {
          onClose(response.data);
        }
      } else {
        response = await axios.post(`${apiUrl}/api/tasks`, submissionData, { headers });
        console.log("Task created:", response.data);
        
        if (typeof onTaskCreated === 'function') {
          onTaskCreated(response.data);
        } else if (typeof onClose === 'function') {
          onClose(response.data);
        }
      }
      
    } catch (error) {
      console.error("Error saving task:", error);
      alert(`Error: ${error.response?.data || error.message}`);
    }
  };
 
  return (
    <div className="p-6 bg-white rounded-xl shadow-xl ">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Topic</label>
          <input
            type="text"
            name="topic"
            value={taskData.topic}
            onChange={handleChange}
            required
            className="w-full py-2 px-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
 
        <div>
          <label className="block text-sm font-semibold text-gray-700">SubTopic</label>
          <input
            type="text"
            name="subTopic"
            value={taskData.subTopic}
            onChange={handleChange}
            required
            className="w-full py-2 px-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
 
        <div>
          <label className="block text-sm font-semibold text-gray-700">Priority (1-10)</label>
          <input
            type="number"
            name="priority"
            value={taskData.priority}
            onChange={handleChange}
            required
            min="0"
            max="10"
            className="w-full py-2 px-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
 
        <div>
          <label className="block text-sm font-semibold text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={taskData.startDate}
            onChange={handleChange}
            required
            className="w-full py-2 px-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
 
        <div>
          <label className="block text-sm font-semibold text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={taskData.endDate}
            onChange={handleChange}
            required
            min={taskData.startDate} 
            className="w-full py-2 px-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
 
        <div>
          <label className="block text-sm font-semibold text-gray-700">Expected Hours</label>
          <input
            type="number"
            name="expectedHours"
            value={taskData.expectedHours}
            onChange={handleChange}
            required
            min="0"
            className="w-full py-2 px-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
 
        <div>
          <label className="block text-sm font-semibold text-gray-700">Completed Hours</label>
          <input
            type="number"
            name="completedHours"
            value={taskData.completedHours}
            onChange={handleChange}
            required
            min="0"
            className="w-full py-2 px-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
 
        <div>
          <label className="block text-sm font-semibold text-gray-700">Status</label>
          <select
            name="status"
            value={taskData.status}
            onChange={handleChange}
            required
            className="w-full py-2 px-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
 
        {errorMessage && (
          <div className="col-span-3 text-red-500 mt-2">{errorMessage}</div>
        )}
 
        <div className="col-span-3">
          <label className="block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            rows="3"
            className="w-full py-2 px-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          ></textarea>
        </div>
 
        <div className="col-span-3 flex justify-end gap-4 mt-4">
          <button
            type="reset"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-colors"
          >
            {existingTask ? "Update Task" : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
};
 
export default AddTaskForm;