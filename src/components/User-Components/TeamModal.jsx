import React from "react";
import { XCircle, Users } from "lucide-react";
import { format } from "date-fns";

const TeamModal = ({ isOpen, onClose, teams, loading, error }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "-";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Users className="h-5 w-5 mr-2" /> My Teams
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Loading team data...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && teams.length === 0 && (
          <div className="text-center p-4 text-gray-500">
            No team data found.
          </div>
        )}

        {!loading && !error && teams.length > 0 && (
          <div className="overflow-x-auto">
            {teams.map((team) => (
              <div key={team.teamId} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{team.teamName}</h3>
                <p className="text-gray-600 mb-2">{team.description || "No description available."}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Created: {formatDate(team.createdDate)} | Manager: {team.managerName}
                </p>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {team.members.map((member) => (
                      <tr key={member.teamMemberId}>
                        <td className="px-4 py-2 text-sm text-gray-900">{member.username}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{member.email}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{formatDate(member.joinedDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamModal;