// src/pages/DashboardPage.jsx
import React from "react";
import Dashboard from "../components/Dashboard"; // or move this to pages if you prefer

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
