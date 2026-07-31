import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Wrench, 
  AlertOctagon, 
  Users, 
  CheckCircle, 
  Clock, 
  Cpu, 
  Activity,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { reportService } from '../services/reportService';
import { StatCard } from '../components/cards/StatCard';
import { IssueTrendChart } from '../components/charts/IssueTrendChart';
import { SeverityPieChart } from '../components/charts/SeverityPieChart';
import { RepairStatusChart } from '../components/charts/RepairStatusChart';
import { HeatMapChart } from '../components/charts/HeatMapChart';
import { ActivityCard } from '../components/cards/ActivityCard';
import { IssueTable } from '../components/tables/IssueTable';
import { IssueDetailsModal } from '../components/modals/IssueDetailsModal';
import type { Issue } from '../types';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [severities, setSeverities] = useState<any[]>([]);
  const [riskIndex, setRiskIndex] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [reports, setReports] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Dashboard details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dash = await dashboardService.getDashboard();
        const reps = await reportService.getReports();

        setStats(dash.stats);
        setTrends(dash.issueTrends);
        setSeverities(dash.severityDistribution);
        setRiskIndex(dash.riskIndex);
        setActivities(dash.recentActivities);
        setReports(reps.slice(0, 3)); // show first 3 latest reports
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center text-slate-400 select-none">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          <span className="text-xs font-semibold">Aggregating Municipal Sensor Nodes...</span>
        </div>
      </div>
    );
  }

  // Animation configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white leading-tight">Executive Command Center</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">Live predictive telemetry and incident reports for municipal services.</p>
        </div>
        <div className="flex items-center gap-2 text-xs select-none">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="font-semibold text-slate-500 dark:text-slate-400">All Systems Operational</span>
        </div>
      </div>

      {/* Stats Cards Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports"
          value={stats?.totalReports}
          description="Citizen logged + AI detected"
          icon={FileText}
          trend={{ value: 12.4, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Pending Repairs"
          value={stats?.pendingRepairs}
          description="Repairs active in queue"
          icon={Wrench}
          trend={{ value: 4.8, isPositive: false }}
          color="orange"
        />
        <StatCard
          title="Critical Damage"
          value={stats?.criticalDamage}
          description="Immediate hazard alarm"
          icon={AlertOctagon}
          color="red"
        />
        <StatCard
          title="Engineers Active"
          value={stats?.engineersActive}
          description="Out of 50 total personnel"
          icon={Users}
          color="teal"
        />
        <StatCard
          title="Completed Repairs"
          value={stats?.completedRepairs}
          description="Lifetime resolutions logged"
          icon={CheckCircle}
          trend={{ value: 18.2, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Avg Resolution"
          value={stats?.averageResolutionTime}
          description="Mean repair ticket lifecycle"
          icon={Clock}
          color="slate"
        />
        <StatCard
          title="AI Inference Accuracy"
          value={`${stats?.aiAccuracy}%`}
          description="Deep learning pre-screen"
          icon={Cpu}
          color="blue"
        />
        <StatCard
          title="Infrastructure Health"
          value={`${stats?.infrastructureHealthScore}%`}
          description="Aggregate city health rating"
          icon={Activity}
          trend={{ value: 2.1, isPositive: true }}
          color="teal"
        />
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main trend chart */}
        <motion.div 
          variants={itemVariants} 
          className="xl:col-span-2 bg-white dark:bg-darkbg-card p-5 rounded-2xl border border-slate-200/80 dark:border-darkbg-border"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-brand-500" /> Logged vs Resolved Incident Trends
            </h3>
          </div>
          <IssueTrendChart data={trends} />
        </motion.div>

        {/* Severity pie chart */}
        <motion.div 
          variants={itemVariants} 
          className="bg-white dark:bg-darkbg-card p-5 rounded-2xl border border-slate-200/80 dark:border-darkbg-border"
        >
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
            Severity Distribution
          </h3>
          <SeverityPieChart data={severities} />
        </motion.div>

        {/* Department performance & Monthly details */}
        <motion.div 
          variants={itemVariants} 
          className="xl:col-span-2 bg-white dark:bg-darkbg-card p-5 rounded-2xl border border-slate-200/80 dark:border-darkbg-border"
        >
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
            Resolution Speed & Month-over-Month Backlogs
          </h3>
          <RepairStatusChart data={trends.map((t, idx) => ({
            month: t.month,
            completed: t.repairs,
            backlog: Math.max(10, 40 - idx * 4),
            avgDays: Number((3 + Math.sin(idx) * 1.2).toFixed(1))
          }))} />
        </motion.div>

        {/* Radar Risk index chart */}
        <motion.div 
          variants={itemVariants} 
          className="bg-white dark:bg-darkbg-card p-5 rounded-2xl border border-slate-200/80 dark:border-darkbg-border"
        >
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
            Predictive Risk Index by City Sectors
          </h3>
          <HeatMapChart data={riskIndex} />
        </motion.div>
      </div>

      {/* Bottom tables & Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Latest citizen reports table */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-2 bg-white dark:bg-darkbg-card p-5 rounded-2xl border border-slate-200/80 dark:border-darkbg-border"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Recent Anomalies Dispatch Board
            </h3>
            <Link 
              to="/assets" 
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-0.5"
            >
              Inspect all issues <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <IssueTable 
            issues={reports} 
            onViewDetails={(issue) => {
              setSelectedIssue(issue);
              setIsDetailsOpen(true);
            }} 
          />
        </motion.div>

        {/* Right: Recent activity feed */}
        <motion.div 
          variants={itemVariants} 
          className="bg-white dark:bg-darkbg-card p-5 rounded-2xl border border-slate-200/80 dark:border-darkbg-border"
        >
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
            Platform System Logs
          </h3>
          
          <div className="space-y-1 divide-y divide-slate-100 dark:divide-darkbg-border/60">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Details modal */}
      <IssueDetailsModal
        isOpen={isDetailsOpen}
        issue={selectedIssue}
        onClose={() => setIsDetailsOpen(false)}
      />
    </motion.div>
  );
};
export default Dashboard;
