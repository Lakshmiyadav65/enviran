import React from "react";
import {
  Factory,
  Package,
  Leaf,
  TrendingDown,
  TrendingUp,
  FileText,
  Truck,
  Recycle,
  Zap,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
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
  AreaChart,
  Area,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";

// ── Mock Data ──────────────────────────────────────────────

const productEmissions = [
  { name: "Steel Frame A1", emission: 3420, target: 3000 },
  { name: "Aluminum Panel B2", emission: 2180, target: 2500 },
  { name: "Plastic Housing C3", emission: 1560, target: 1800 },
  { name: "Copper Wire D4", emission: 980, target: 1200 },
  { name: "Glass Sheet E5", emission: 740, target: 900 },
];

const lifecycleBreakdown = [
  { name: "Raw Materials", value: 38, color: "#3B82F6" },
  { name: "Manufacturing", value: 27, color: "#10B981" },
  { name: "Transportation", value: 18, color: "#F59E0B" },
  { name: "End of Life", value: 12, color: "#8B5CF6" },
  { name: "Packaging", value: 5, color: "#EC4899" },
];

const monthlyTrend = [
  { month: "Sep", emissions: 4800 },
  { month: "Oct", emissions: 4520 },
  { month: "Nov", emissions: 4350 },
  { month: "Dec", emissions: 4100 },
  { month: "Jan", emissions: 3890 },
  { month: "Feb", emissions: 3640 },
  { month: "Mar", emissions: 3420 },
];

const supplierScores = [
  { name: "EcoSteel Corp", score: 92, grade: "A", trend: "up" },
  { name: "GreenAlu Ltd", score: 85, grade: "A", trend: "up" },
  { name: "PlastPro Inc", score: 71, grade: "B", trend: "down" },
  { name: "CopperWorks", score: 68, grade: "C", trend: "up" },
  { name: "GlassTech Mfg", score: 54, grade: "D", trend: "down" },
];

const recentActivities = [
  { action: "PCF report submitted for Steel Frame A1", time: "1 hour ago", type: "pcf", status: "completed" },
  { action: "Supplier questionnaire received from EcoSteel Corp", time: "3 hours ago", type: "supplier", status: "completed" },
  { action: "Emission target breached for Plastic Housing C3", time: "5 hours ago", type: "alert", status: "warning" },
  { action: "New product Titanium Rod F6 added to portfolio", time: "1 day ago", type: "product", status: "completed" },
  { action: "Data quality review pending for Copper Wire D4", time: "1 day ago", type: "review", status: "pending" },
  { action: "Monthly emission report generated", time: "2 days ago", type: "pcf", status: "completed" },
];

// ── KPI Card Component ─────────────────────────────────────

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

// ── Main Component ──────────────────────────────────────────

const ManufacturerDashboard: React.FC = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Manufacturer";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "pcf": return <FileText className="w-4 h-4 text-blue-500" />;
      case "supplier": return <Truck className="w-4 h-4 text-green-500" />;
      case "alert": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "product": return <Package className="w-4 h-4 text-purple-500" />;
      case "review": return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-green-100 text-green-700";
      case "B": return "bg-blue-100 text-blue-700";
      case "C": return "bg-amber-100 text-amber-700";
      case "D": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#F8F9FA] p-8 pt-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Header Banner ──────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A5D1A] via-[#2E8B2E] to-[#52C41A] p-8 shadow-lg">
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-white/5 rounded-full" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="bg-white/20 backdrop-blur-sm p-3.5 rounded-2xl border border-white/20">
                <Factory className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {getGreeting()}, {firstName}!
                </h1>
                <p className="text-sm text-green-100 mt-1">
                  Manufacturer Dashboard &mdash; Track your carbon footprint &amp; sustainability goals
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-5">
              <div className="text-right">
                <p className="text-xs font-medium text-white/70 uppercase tracking-wider">This Month</p>
                <p className="text-3xl font-extrabold text-white leading-tight">3,420<span className="text-lg font-bold text-white/80 ml-1">kg</span></p>
                <p className="text-[11px] text-white/60">CO₂e emissions</p>
              </div>
              <div className="w-px h-14 bg-white/30" />
              <div className="text-right">
                <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Reduction</p>
                <p className="text-3xl font-extrabold text-white leading-tight">28.8<span className="text-lg font-bold text-white/80 ml-0.5">%</span></p>
                <p className="text-[11px] text-white/60 flex items-center justify-end gap-1">
                  <TrendingDown className="w-3 h-3" /> vs. 6 months ago
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI Cards ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Products"
            value={12}
            subtitle="5 active PCF requests"
            icon={Package}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <KPICard
            title="Active Suppliers"
            value={18}
            subtitle="3 pending questionnaires"
            icon={Truck}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <KPICard
            title="Avg. Carbon Footprint"
            value="1,776 kg"
            subtitle="CO₂e per product"
            icon={Leaf}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            trend={-12.4}
          />
          <KPICard
            title="Recyclability Rate"
            value="73%"
            subtitle="Above industry avg. (61%)"
            icon={Recycle}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            trend={-5.2}
          />
        </div>

        {/* ── Charts Row 1 ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Emission Trend */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-gray-900">Emission Trend</h3>
              <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                <TrendingDown className="w-3 h-3" /> -28.8% over 6 months
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Monthly total CO₂e emissions (kg)</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="emissionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "12px" }}
                    formatter={(value: any) => [`${value.toLocaleString()} kg CO₂e`, "Emissions"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="emissions"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="url(#emissionGradient)"
                    dot={{ r: 4, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lifecycle Breakdown */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">Lifecycle Breakdown</h3>
            <p className="text-xs text-gray-400 mb-4">Emission distribution by phase</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lifecycleBreakdown}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {lifecycleBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, "Share"]} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", fontWeight: 600 }}
                    formatter={(value: string) => {
                      const entry = lifecycleBreakdown.find((d) => d.name === value);
                      return entry ? `${value} (${entry.value}%)` : value;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Charts Row 2 ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Product Emissions vs Target */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">Product Emissions vs Target</h3>
            <p className="text-xs text-gray-400 mb-4">CO₂e per product (kg) &mdash; actual vs. target</p>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productEmissions}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F3F5" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6B7280" }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#374151", fontWeight: 500 }}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "12px" }}
                    formatter={(value: any, name?: string) => [
                      `${value.toLocaleString()} kg`,
                      name === "emission" ? "Actual" : "Target",
                    ]}
                  />
                  <Bar dataKey="emission" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={14} name="emission" />
                  <Bar dataKey="target" fill="#D1D5DB" radius={[0, 4, 4, 0]} barSize={14} name="target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 mt-2 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                <span className="text-xs text-gray-500 font-medium">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-sm" />
                <span className="text-xs text-gray-500 font-medium">Target</span>
              </div>
            </div>
          </div>

          {/* Supplier Sustainability Scores */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">Supplier Sustainability Scores</h3>
            <p className="text-xs text-gray-400 mb-4">Data quality & environmental rating</p>
            <div className="space-y-3">
              {supplierScores.map((supplier) => (
                <div
                  key={supplier.name}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-800 truncate">{supplier.name}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getGradeColor(supplier.grade)}`}>
                        {supplier.grade}
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${supplier.score}%`,
                          backgroundColor:
                            supplier.score >= 80 ? "#10B981" :
                            supplier.score >= 60 ? "#F59E0B" : "#EF4444",
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-gray-700">{supplier.score}</span>
                    {supplier.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Row ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Quick Stats */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">Energy & Resources</h3>
            <div className="space-y-4">
              {[
                { label: "Energy Consumption", value: "12,480 kWh", change: "-6.2%", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
                { label: "Water Usage", value: "8,340 L", change: "-3.1%", icon: Leaf, color: "text-blue-500", bg: "bg-blue-50" },
                { label: "Waste Generated", value: "1,240 kg", change: "-14.7%", icon: Recycle, color: "text-green-500", bg: "bg-green-50" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50">
                  <div className={`${item.bg} p-2.5 rounded-xl`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                    <p className="text-sm font-bold text-gray-800">{item.value}</p>
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{item.change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">Recent Activity</h3>
            <p className="text-xs text-gray-400 mb-4">Latest updates from your operations</p>
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
                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                  <div className="shrink-0 mt-1">
                    {getStatusBadge(activity.status)}
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

export default ManufacturerDashboard;
