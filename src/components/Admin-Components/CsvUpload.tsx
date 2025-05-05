import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { apiUrl } from "../../config";
import { Upload, UserPlus, AlertCircle, Check } from "lucide-react";

// Define the structure of the employee data
interface EmployeeData {
  employeeId?: number;
  username: string;
  email: string;
  roleID: number;
  managerID: number | null;
}

const CsvUpload = () => {
  const [csvData, setCsvData] = useState<EmployeeData[]>([]);
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [statusType, setStatusType] = useState(""); // "success", "error", or ""
  const [newEmployee, setNewEmployee] = useState<EmployeeData>({
    username: "",
    email: "",
    roleID: 1,
    managerID: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setFileName(file.name);
    setStatusType("");
    setUploadStatus("");
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data.map((item: any) => ({
          employeeId: item.employeeId ? parseInt(item.employeeId, 10) : undefined,
          username: item.username,
          email: item.email,
          roleID: parseInt(item.roleID, 10),
          managerID: item.managerID === "null" ? null : parseInt(item.managerID, 10),
        }));
        setCsvData(parsedData as EmployeeData[]);
        setStatusType("success");
        setUploadStatus(`${parsedData.length} records ready to upload`);
      },
      error: (error) => {
        console.error("Error parsing CSV file:", error);
        setStatusType("error");
        setUploadStatus(`Error parsing CSV: ${error.message}`);
      },
    });
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files[0];
    if (file && file.name.endsWith('.csv')) {
      processFile(file);
    } else {
      setStatusType("error");
      setUploadStatus("Please upload a valid CSV file");
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUploading(true);
    setStatusType("");
    setUploadStatus("Uploading...");
    
    try {
      const jsonData = JSON.stringify(csvData);
      const response = await axios.post(`${apiUrl}/api/Admin/batch-insert`, jsonData, {
        headers: { "Content-Type": "application/json" }
      });
      setStatusType("success");
      setUploadStatus("Employees added successfully!");
      setCsvData([]);
      setFileName("");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error uploading data:", error);
      setStatusType("error");
      setUploadStatus(`Failed to add employees: ${error.message || error.response?.data || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  // Handle new employee creation
  const handleCreateEmployee = async () => {
    setUploading(true);
    setStatusType("");
    setUploadStatus("Creating new employee...");
    
    try {
      const response = await axios.post(`${apiUrl}/api/Admin/create-employee`, newEmployee, {
        headers: { "Content-Type": "application/json" }
      });
      setStatusType("success");
      setUploadStatus("Employee created successfully!");
      setNewEmployeeEmail(newEmployee.email);
      setNewEmployee({ username: "", email: "", roleID: 1, managerID: null });
      setTimeout(() => {
        setShowModal(false);
        setNewEmployeeEmail("");
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error creating employee:", error);
      setStatusType("error");
      setUploadStatus(`Failed to create employee: ${error.message || error.response?.data || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  // Handle input change for new employee
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setNewEmployee((prevState) => ({
      ...prevState,
      [name]: name === "roleID" || name === "managerID" ? parseInt(value, 10) : value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
       
        
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <UserPlus size={18} className="mr-2" />
          <span>Add Employee</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          } transition-colors cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Upload size={24} />
            </div>
            <div className="text-gray-700 font-medium">
              {fileName ? (
                <span>Selected: <span className="font-semibold text-blue-600">{fileName}</span></span>
              ) : (
                <span>Drag & drop a CSV file or click to browse</span>
              )}
            </div>
            <p className="text-sm text-gray-500 max-w-sm">
              Upload a CSV file with employee data to bulk import records
            </p>
          </div>
        </div>

        {/* Status Message */}
        {uploadStatus && (
          <div className={`p-3 rounded-lg flex items-start ${
            statusType === 'success' ? 'bg-green-50 text-green-700' : 
            statusType === 'error' ? 'bg-red-50 text-red-700' : 
            'bg-blue-50 text-blue-700'
          }`}>
            <div className="mt-0.5 mr-3">
              {statusType === 'success' ? <Check size={18} /> :
               statusType === 'error' ? <AlertCircle size={18} /> :
               <Upload size={18} />}
            </div>
            <p>{uploadStatus}</p>
          </div>
        )}

        {/* Submit Button */}
        {csvData.length > 0 && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm ${
                uploading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              } transition-colors`}
            >
              {uploading ? 'Processing...' : 'Upload Employee Data'}
            </button>
          </div>
        )}
      </form>

      {/* New Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn"
            style={{animation: 'fadeIn 0.2s ease-out'}}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Employee
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewEmployeeEmail("");
                  setUploadStatus("");
                  setStatusType("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={newEmployee.username}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="roleID"
                  value={newEmployee.roleID}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value={1}>User</option>
                  <option value={2}>Manager</option>
                  <option value={3}>Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manager ID (optional)</label>
                <input
                  type="number"
                  name="managerID"
                  placeholder="Leave empty for no manager"
                  value={newEmployee.managerID || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              {/* Status Messages */}
              {uploadStatus && statusType && (
                <div className={`p-3 rounded-lg flex items-start ${
                  statusType === 'success' ? 'bg-green-50 text-green-700' : 
                  'bg-red-50 text-red-700'
                }`}>
                  <div className="mt-0.5 mr-3">
                    {statusType === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                  </div>
                  <p className="text-sm">{uploadStatus}</p>
                </div>
              )}
              
              <button
                type="button"
                onClick={handleCreateEmployee}
                disabled={!newEmployee.username || !newEmployee.email || uploading}
                className={`w-full py-2 rounded-lg transition-colors ${
                  !newEmployee.username || !newEmployee.email || uploading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                }`}
              >
                {uploading ? 'Creating...' : 'Create Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvUpload;