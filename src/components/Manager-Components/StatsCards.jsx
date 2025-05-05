import React from "react";
import { FaUsers, FaCheckCircle, FaClock, FaHourglassStart, FaUsersCog } from "react-icons/fa";

const StatsCards = ({ stats, themeColors, statusFilter, handleStatusCardClick }) => {
    const cardStyles = {
        base: `
            p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 
            border border-gray-200 shadow-lg cursor-pointer 
            transition-all duration-300 ease-in-out
            hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]
        `,
        active: `ring-2 ring-offset-2`,
        inactive: `opacity-95`,
    };

    const iconStyles = {
        total: { bg: "bg-blue-100/80", color: "text-blue-700" },
        completed: { bg: "bg-green-100/80", color: "text-green-700" },
        inProgress: { bg: "bg-yellow-100/80", color: "text-yellow-700" },
        notStarted: { bg: "bg-red-100/80", color: "text-red-700" },
        teams: { bg: "bg-purple-100/80", color: "text-purple-700" },
    };

    const ringColors = {
        total: themeColors.primary,
        completed: themeColors.success,
        inProgress: themeColors.warning,
        notStarted: themeColors.danger,
        teams: themeColors.accent,
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
            {/* Total Employees Card */}
            <div
                className={`${cardStyles.base} ${
                    statusFilter === "total" ? cardStyles.active : cardStyles.inactive
                }`}
                style={{
                    ringColor: statusFilter === "total" ? ringColors.total : "transparent",
                }}
                onClick={() => handleStatusCardClick("total")}
            >
                <div className="flex items-center space-x-4">
                    <div className={`${iconStyles.total.bg} ${iconStyles.total.color} p-3 rounded-xl backdrop-blur-sm`}>
                        <FaUsers className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-600">Total Employees</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
                    </div>
                </div>
            </div>

            {/* Completed Card */}
            <div
                className={`${cardStyles.base} ${
                    statusFilter === "completed" ? cardStyles.active : cardStyles.inactive
                }`}
                style={{
                    ringColor: statusFilter === "completed" ? ringColors.completed : "transparent",
                }}
                onClick={() => handleStatusCardClick("completed")}
            >
                <div className="flex items-center space-x-4">
                    <div className={`${iconStyles.completed.bg} ${iconStyles.completed.color} p-3 rounded-xl backdrop-blur-sm`}>
                        <FaCheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
                    </div>
                </div>
            </div>

            {/* In Progress Card */}
            <div
                className={`${cardStyles.base} ${
                    statusFilter === "in progress" ? cardStyles.active : cardStyles.inactive
                }`}
                style={{
                    ringColor: statusFilter === "in progress" ? ringColors.inProgress : "transparent",
                }}
                onClick={() => handleStatusCardClick("in progress")}
            >
                <div className="flex items-center space-x-4">
                    <div className={`${iconStyles.inProgress.bg} ${iconStyles.inProgress.color} p-3 rounded-xl backdrop-blur-sm`}>
                        <FaClock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-600">In Progress</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.inProgressTasks}</p>
                    </div>
                </div>
            </div>

            {/* Not Started Card */}
            <div
                className={`${cardStyles.base} ${
                    statusFilter === "not started" ? cardStyles.active : cardStyles.inactive
                }`}
                style={{
                    ringColor: statusFilter === "not started" ? ringColors.notStarted : "transparent",
                }}
                onClick={() => handleStatusCardClick("not started")}
            >
                <div className="flex items-center space-x-4">
                    <div className={`${iconStyles.notStarted.bg} ${iconStyles.notStarted.color} p-3 rounded-xl backdrop-blur-sm`}>
                        <FaHourglassStart className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-600">Not Started</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
                    </div>
                </div>
            </div>

            {/* Teams Card */}
            <div
                className={`${cardStyles.base} ${
                    statusFilter === "teams" ? cardStyles.active : cardStyles.inactive
                }`}
                style={{
                    ringColor: statusFilter === "teams" ? ringColors.teams : "transparent",
                }}
                onClick={() => handleStatusCardClick("teams")}
            >
                <div className="flex items-center space-x-4">
                    <div className={`${iconStyles.teams.bg} ${iconStyles.teams.color} p-3 rounded-xl backdrop-blur-sm`}>
                        <FaUsersCog className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-600">Teams</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalTeams}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCards;