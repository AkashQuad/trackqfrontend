import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config";
import EmployeeTaskHistory from "./EmployeeTaskHistory";

const EmployeeTasksPage = () => {
  const { employeeId } = useParams();
  const location = useLocation();
  const { username, date } = location.state || {};
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    fetchTasks();
  }, [employeeId, date]);

  const fetchTasks = () => {
    setLoading(true);
    setError("");
    axios
      .get(`${apiUrl}/api/Tasks/details`, {
        params: {
          dateQ: date.toLocaleDateString("en-CA"),
          employeeId,
        },
      })
      .then((response) => {
        const tasksData = response.data || [];
        setTasks(tasksData);
        const stats = {
          totalTasks: tasksData.length,
          completedTasks: tasksData.filter(t => t.status.toLowerCase() === "completed").length,
          inProgressTasks: tasksData.filter(t => t.status.toLowerCase() === "in progress").length,
          pendingTasks: tasksData.filter(t => t.status.toLowerCase() === "not started").length,
        };
        setStats(stats);
      })
      .catch((err) => {
        setError("Failed to load tasks");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h2 className="text-3xl font-bold mb-6">Tasks for {username} - {date.toLocaleDateString()}</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg shadow">
                <p>Total Tasks: {stats.totalTasks}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <p>Completed: {stats.completedTasks}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <p>In Progress: {stats.inProgressTasks}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <p>Pending: {stats.pendingTasks}</p>
              </div>
            </div>
            <EmployeeTaskHistory
              employeeId={employeeId}
              username={username}
              tasks={tasks}
              themeColors={{ primary: "#6B46C1", success: "#10B981", warning: "#F59E0B", danger: "#EF4444" }}
              onClose={() => navigate(-1)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeTasksPage;