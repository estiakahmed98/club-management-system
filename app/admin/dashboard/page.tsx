"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  Trophy, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
  Award
} from "lucide-react";

interface DashboardStats {
  totalMembers: number;
  totalEvents: number;
  totalMatches: number;
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  recentMembers?: number;
  upcomingEvents?: number;
  winRate?: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalEvents: 0,
    totalMatches: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalBalance: 0,
    recentMembers: 0,
    upcomingEvents: 0,
    winRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError("Failed to load statistics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: "Total Members",
      value: stats.totalMembers,
      icon: Users,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      trend: stats.recentMembers,
      trendLabel: "new this month",
      suffix: "",
    },
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: Calendar,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      trend: stats.upcomingEvents,
      trendLabel: "upcoming",
      suffix: "",
    },
    {
      title: "Total Matches",
      value: stats.totalMatches,
      icon: Trophy,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      trend: stats.winRate,
      trendLabel: "win rate",
      suffix: "%",
      trendUp: true,
    },
    {
      title: "Total Income",
      value: formatCurrency(stats.totalIncome),
      icon: TrendingUp,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      suffix: "",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(stats.totalExpenses),
      icon: TrendingDown,
      iconColor: "text-rose-600",
      bgColor: "bg-rose-50 dark:bg-rose-950/30",
      suffix: "",
    },
    {
      title: "Net Balance",
      value: formatCurrency(stats.totalBalance),
      icon: Wallet,
      iconColor: stats.totalBalance >= 0 ? "text-emerald-600" : "text-rose-600",
      bgColor: stats.totalBalance >= 0 
        ? "bg-emerald-50 dark:bg-emerald-950/30" 
        : "bg-rose-50 dark:bg-rose-950/30",
      suffix: "",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back! Here's an overview of your club's performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Activity className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const isPositiveTrend = card.trend && card.trend > 0;
          
          return (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                    {card.suffix && <span className="text-lg ml-1">{card.suffix}</span>}
                  </div>
                  
                  {card.trend !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 text-xs font-medium ${
                        isPositiveTrend ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {isPositiveTrend ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        <span>{Math.abs(card.trend)}</span>
                      </div>
                      <span className="text-xs text-gray-500">{card.trendLabel}</span>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">vs last month</span>
                      <span className={`font-medium ${
                        index === 3 ? "text-emerald-600" : 
                        index === 4 ? "text-rose-600" : 
                        "text-gray-600"
                      }`}>
                        {index === 3 && "+12.5%"}
                        {index === 4 && "+8.3%"}
                        {index !== 3 && index !== 4 && "+5.2%"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New member joined", time: "2 hours ago", icon: Users },
                { action: "Event registration opened", time: "5 hours ago", icon: Calendar },
                { action: "Match scheduled", time: "1 day ago", icon: Trophy },
                { action: "Payment received", time: "2 days ago", icon: DollarSign },
              ].map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                      View
                    </button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Add Member", icon: Users, color: "bg-blue-600" },
                { label: "Create Event", icon: Calendar, color: "bg-purple-600" },
                { label: "Schedule Match", icon: Trophy, color: "bg-orange-600" },
                { label: "Record Payment", icon: DollarSign, color: "bg-emerald-600" },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    className="group relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <Icon className={`w-6 h-6 ${action.color.replace("bg-", "text-")} mx-auto mb-2`} />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                      {action.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <Award className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalMatches || 0}
          </p>
          <p className="text-xs text-gray-500">Total Matches</p>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <Users className="w-5 h-5 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalMembers || 0}
          </p>
          <p className="text-xs text-gray-500">Active Members</p>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalEvents || 0}
          </p>
          <p className="text-xs text-gray-500">Events Organized</p>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <Wallet className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(stats.totalBalance)}
          </p>
          <p className="text-xs text-gray-500">Current Balance</p>
        </div>
      </div>
    </div>
  );
}