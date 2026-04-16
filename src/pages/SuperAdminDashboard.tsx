import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  Truck,
  FileText,
  Leaf,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
  Globe,
  BarChart3,
  ClipboardList,
} from "lucide-react";
import { Select } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";
import { ChartTooltip, chartTooltipCursor } from "../components/DashboardComponents";
import dashboardService from "../lib/dashboardService";

interface Client {
  user_id: string;
  user_name: string;
}

// Platform summary stats (mock data since no aggregate API exists yet)
const platformStats = {
  totalClients: 24,
  activeClients: 18,
  totalSuppliers: 156,
  totalPCFRequests: 342,
  pendingRequests: 28,
  completedRequests: 289,
  avgEmission: 1847,
  emissionTrend: -8.3,
};

const clientStatusData = [
  { name: "Active", value: 18, color: "#52C41A" },
  { name: "Pending", value: 4, color: "#FAAD14" },
  { name: "Inactive", value: 2, color: "#FF4D4F" },
];

const requestStatusData = [
  { name: "Completed", value: 289, color: "#52C41A" },
  { name: "In Progress", value: 25, color: "#1890FF" },
  { name: "Pending", value: 28, color: "#FAAD14" },
];

const topEmitters = [
  { name: "Govardhan Mfg.", emission: 4520 },
  { name: "Apex Industries", emission: 3180 },
  { name: "GreenTech Corp", emission: 2740 },
  { name: "EcoWorks Ltd", emission: 1960 },
  { name: "NovaMaterials", emission: 1450 },
];

const recentActivities = [
  { action: "PCF Request submitted", client: "Govardhan Mfg.", time: "2 hours ago", type: "pcf" },
  { action: "New supplier onboarded", client: "Apex Industries", time: "5 hours ago", type: "supplier" },
  { action: "Report exported", client: "GreenTech Corp", time: "1 day ago", type: "report" },
  { action: "PCF Request approved", client: "EcoWorks Ltd", time: "1 day ago", type: "pcf" },
  { action: "Questionnaire completed", client: "NovaMaterials", time: "2 days ago", type: "questionnaire" },
];

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  iconBg: string;
  iconColor: string;
  trend?: number;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, subtitle, icon: Icon, iconBg, iconColor, trend }) => (
  <div className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
    {/* Subtle gradient accent on hover */}
    <div className={`absolute inset-0 ${iconBg} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />
    <div className="relative">
      <div className="flex justify-between items-start mb-4">
        <div className={`${iconBg} ${iconColor} p-3 rounded-2xl shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            trend < 0 ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
          }`}>
            {trend < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
            {trend > 0 ? "+" : ""}{trend}%
          </div>
        )}
      </div>
      <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
      <p className="text-sm font-semibold text-gray-500 mt-1.5">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);

  const firstName = user?.name?.split(" ")[0] || "Admin";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Demo clients for development — will be replaced by API data in production
  const demoClients: Client[] = [
    { user_id: "demo-1", user_name: "govardhan_manufacturer" },
    { user_id: "demo-2", user_name: "Apex Industries" },
    { user_id: "demo-3", user_name: "GreenTech Corp" },
    { user_id: "demo-4", user_name: "EcoWorks Ltd" },
    { user_id: "demo-5", user_name: "NovaMaterials" },
    { user_id: "demo-6", user_name: "SteelCraft Inc." },
    { user_id: "demo-7", user_name: "BioPlast Solutions" },
    { user_id: "demo-8", user_name: "MetalForge Industries" },
  ];

  useEffect(() => {
    const fetchClients = async () => {
      const result = await dashboardService.getClientsDropdown();
      if (result.status === true || result.success === true || result.data) {
        const clientList = Array.isArray(result.data)
          ? result.data
          : result.data?.data && Array.isArray(result.data.data)
            ? result.data.data
            : [];
        setClients(clientList.length > 0 ? clientList : demoClients);
      } else {
        setClients(demoClients);
      }
    };
    fetchClients();
  }, []);

  const handleClientDrillDown = (clientId: string) => {
    const client = clients.find(c => c.user_id === clientId);
    if (client) {
      navigate("/dashboard", { state: { selectedClient: client, fromSuperAdmin: true } });
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "pcf": return <FileText className="w-4 h-4 text-blue-500" />;
      case "supplier": return <Truck className="w-4 h-4 text-green-500" />;
      case "report": return <BarChart3 className="w-4 h-4 text-purple-500" />;
      case "questionnaire": return <ClipboardList className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#F8F9FA] p-8 pt-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A5D1A] via-[#2E8B2E] to-[#52C41A] p-8 shadow-lg">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-white/5 rounded-full" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="bg-white/20 backdrop-blur-sm p-3.5 rounded-2xl border border-white/20">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {getGreeting()}, {firstName}!
                </h1>
                <p className="text-sm text-green-100 mt-1">
                  Platform Overview - EnviGuide Management Suite
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20 text-center">
                <p className="text-xs font-semibold text-white/80">Active Clients</p>
                <p className="text-xl font-extrabold text-white">{platformStats.activeClients}/{platformStats.totalClients}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20 text-center">
                <p className="text-xs font-semibold text-white/80">Pending Requests</p>
                <p className="text-xl font-extrabold text-amber-300">{platformStats.pendingRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Clients"
            value={platformStats.totalClients}
            subtitle={`${platformStats.activeClients} active`}
            icon={Building2}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <KPICard
            title="Total Suppliers"
            value={platformStats.totalSuppliers}
            subtitle="Across all clients"
            icon={Truck}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <KPICard
            title="PCF Requests"
            value={platformStats.totalPCFRequests}
            subtitle={`${platformStats.pendingRequests} pending`}
            icon={FileText}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
          />
          <KPICard
            title="Avg. Emissions"
            value={`${platformStats.avgEmission} kg`}
            subtitle="CO₂e per client"
            icon={Leaf}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            trend={platformStats.emissionTrend}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Status Pie Chart */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">Client Status</h3>
            <p className="text-xs text-gray-400 mb-4">Distribution by status</p>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clientStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {clientStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Request Status Pie Chart */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">PCF Request Status</h3>
            <p className="text-xs text-gray-400 mb-4">Overall request pipeline</p>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {requestStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Emitters Bar Chart */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">Top Emitting Clients</h3>
            <p className="text-xs text-gray-400 mb-4">By total CO₂e emissions</p>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topEmitters}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F3F5" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#4B5563" }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#4B5563", fontWeight: 500 }}
                    width={100}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={chartTooltipCursor} />
                  <Bar dataKey="emission" fill="#52C41A" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row: Client Drill-Down + Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Drill-Down Selector */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">Client Drill-Down</h3>
            <p className="text-xs text-gray-400 mb-4">
              Select a client to view their detailed carbon footprint dashboard
            </p>
            <Select
              showSearch
              placeholder="Search and select a client..."
              className="w-full"
              size="large"
              filterOption={(input, option) =>
                (option?.label as string ?? "").toLowerCase().includes(input.toLowerCase())
              }
              onChange={(value) => handleClientDrillDown(value)}
              options={clients.map((c) => ({
                value: c.user_id,
                label: c.user_name,
              }))}
              virtual
              notFoundContent={
                <div className="text-center py-4 text-gray-400 text-sm">
                  No clients found
                </div>
              }
            />

            {/* Quick client list */}
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent Clients</p>
              {clients.slice(0, 5).map((client) => (
                <div
                  key={client.user_id}
                  onClick={() => handleClientDrillDown(client.user_id)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-green-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                      <Building2 className="w-4 h-4 text-gray-500 group-hover:text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                      {client.user_name}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
              {clients.length === 0 && (
                <p className="text-sm text-gray-400 py-2">No clients available</p>
              )}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">Recent Activity</h3>
            <p className="text-xs text-gray-400 mb-4">Latest actions across the platform</p>
            <div className="space-y-1">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center mt-0.5 shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-400">
                      {activity.client} &middot; {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
