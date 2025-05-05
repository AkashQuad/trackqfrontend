import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../config";

const TaskTable = ({ employeeId, selectedDate }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${apiUrl}/api/tasks/GetTasksByEmployeeAndDate/${employeeId}/${selectedDate.toISOString()}`);
                setTasks(response.data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [employeeId, selectedDate]);

    if (loading) return <p>Loading tasks...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Tasks for Employee ID: {employeeId} on {selectedDate.toLocaleDateString()}</h2>
            {tasks.length === 0 ? (
                <p>No tasks found for this employee on this date.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Task ID</th>
                            <th>Topic</th>
                            <th>Sub Topic</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Total Hours</th>
                            <th>Priority</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.taskId}>
                                <td>{task.taskId}</td>
                                <td>{task.topic}</td>
                                <td>{task.subTopic}</td>
                                <td>{task.description}</td>
                                <td>{task.date}</td>
                                <td>{task.totalHours}</td>
                                <td>{task.priority}</td>
                                <td>{task.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TaskTable;