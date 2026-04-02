import React from "react";
import { useAuth } from "../contexts/AuthContext";
import SuperAdminDashboard from "./SuperAdminDashboard";
import Dashboard from "./Dashboard";

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  // EnviGuide super admins see the platform-level overview
  // Manufacturers and suppliers see the client-level carbon footprint dashboard
  const isSuperAdmin =
    user?.role?.toLowerCase() === "superadmin" ||
    user?.role?.toLowerCase() === "super admin" ||
    user?.role?.toLowerCase() === "enviguide" ||
    user?.role?.toLowerCase() === "admin";

  if (isSuperAdmin) {
    return <SuperAdminDashboard />;
  }

  return <Dashboard />;
};

export default DashboardRouter;
