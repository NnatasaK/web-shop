import React, { useEffect, useState } from "react";
import axios from "axios";
import { LoginLog } from "../utils/entities";

const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LoginLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/login-logs`,
          {
            withCredentials: true,
          }
        );
        setLogs(response.data.logs);
      } catch (error) {
        console.error("Error fetching login logs:", error);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl text-gray-300 font-bold mb-6">Login Logs</h1>
      <table className="min-w-full bg-gray-200 rounded-md">
        <thead>
          <tr>
            <th className="py-2">Time</th>
            <th className="py-2">Username</th>
            <th className="py-2">Success</th>
            <th className="py-2">IP Address</th>
            <th className="py-2">User Agent</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index} className="text-center border-b">
              <td className="py-2">{log.time}</td>
              <td className="py-2">{log.username}</td>
              <td className="py-2">{log.success ? "Yes" : "No"}</td>
              <td className="py-2">{log.ip_address}</td>
              <td className="py-2">{log.user_agent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLogsPage;
