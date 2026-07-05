import styles from "../../styles/Dashboard.module.css";
import {
  Pie, PieChart,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
  type PieSectorShapeProps,
  Sector,
  Rectangle
} from "recharts";
import { StatCard } from "./StatCard";
import type { Application } from "../../types";

type Props = { applications: Application[] };

export default function StatsChart({ applications }: Props) {
  const total       = applications.length;
  const totalApplied = applications.filter(a => a.status !== "SAVED").length;
  const gotResponse  = applications.filter(a =>
    ["INTERVIEWING", "OFFER", "REJECTED"].includes(a.status)
  ).length;
  const responseRate = totalApplied ? Math.round((gotResponse / totalApplied) * 100) : 0;

  return (
    <div className={styles.main}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>DASHBOARD</h1>
          <p className={styles.pageSubtitle}>Track and analyze your job search progress.</p>
        </div>
      </div>

      <div className={styles.statCards}>
        <StatCard label="Total Applications" value={total} sub="All time" accent />
        <StatCard label="Response Rate" value={`${responseRate}%`} sub={`${gotResponse} of ${totalApplied}`} />
        <StatCard label="Applied" value={totalApplied} sub="Submitted" />
        <StatCard label="Interviewing" value={applications.filter(a => a.status === "INTERVIEWING").length} sub="Active" />
      </div>

      <div className={styles.container}>
        <div className={`${styles.card} ${styles.pieCard}`}>
          <h2 className={styles.cardTitle}>Applications by status</h2>
          <AppsStatus applications={applications} />
        </div>

        <div className={`${styles.card} ${styles.barCard}`}>
          <h2 className={styles.cardTitle}>Applications over time</h2>
          <AppsOverTime applications={applications} />
        </div>

        <div className={`${styles.card} ${styles.rateCard}`}>
          <h2 className={styles.cardTitle}>Response rate</h2>
          <ResponseRate applications={applications} />
        </div>

        <div className={`${styles.card} ${styles.funnelCard}`}>
          <h2 className={styles.cardTitle}>Stage conversion</h2>
          <StageConversion applications={applications} />
        </div>

        <div className={`${styles.card} ${styles.respondCard}`}>
          <h2 className={styles.cardTitle}>Time to respond</h2>
          <TimeToRespond applications={applications} />
        </div>
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  SAVED: "#378ADD", APPLIED: "#1D9E75", INTERVIEWING: "#BA7517",
  OFFER: "#639922", REJECTED: "#D85A30", WITHDRAWN: "#888780",
};

function AppsStatus({ applications }: Props) {
  const counts = applications.reduce<Record<string, number>>((acc, app) => {
    acc[app.status] = (acc[app.status] ?? 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([name, value]) => ({
    name, value, fill: STATUS_COLORS[name] ?? "#ccc",
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={110}
          paddingAngle={3}
          shape={(props: PieSectorShapeProps) => (
            <Sector {...props} fill={(props as any).fill} />
          )}
        />
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function AppsOverTime({ applications }: Props) {
  const byWeek = Array.from({ length: 8 }, (_, i) => {
    const start = new Date(Date.now() - (7 - i) * 7 * 86400000);
    const end   = new Date(Date.now() - (6 - i) * 7 * 86400000);
    return {
      week: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: applications.filter(a => {
        const d = new Date(a.createdAt);
        return d >= start && d < end;
      }).length,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={byWeek}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="week" axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#1F4A30" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ResponseRate({ applications }: Props) {
  const total     = applications.filter(a => a.status !== "SAVED").length;
  const responded = applications.filter(a =>
    ["INTERVIEWING", "OFFER", "REJECTED"].includes(a.status)
  ).length;
  const ghosted = total - responded;
  const data = [
    { name: "Responded", value: responded, fill: "#1D9E75" },
    { name: "No response", value: ghosted, fill: "#D85A30" },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={3}
          shape={(props: PieSectorShapeProps) => (
            <Sector {...props} fill={(props as any).fill} />
          )}
        />
        <Tooltip formatter={(v, n) => [`${v} (${total ? Math.round((Number(v)/total)*100) : 0}%)`, n]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function StageConversion({ applications }: Props) {
  const data = [
    { stage: "Applied", count: applications.filter(a => a.status !== "SAVED").length, fill: "#1F4A30" },
    { stage: "Interviewing", count: applications.filter(a => ["INTERVIEWING", "OFFER"].includes(a.status)).length, fill: "#3E7A52" },
    { stage: "Offer", count: applications.filter(a => a.status === "OFFER").length, fill: "#8FBE9F" },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="stage" width={90} axisLine={false} tickLine={false} />
        <Tooltip />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} shape={(props: any) => <Rectangle {...props} fill={props.fill} />} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function TimeToRespond({ applications }: Props) {
  const withBoth = applications.filter(a => a.appliedAt && a.interviewAt);
  const data = withBoth.map(a => ({
    company: a.job?.company ?? "Unknown",
    days: Math.round(
      (new Date(a.interviewAt!).getTime() - new Date(a.appliedAt!).getTime()) / 86400000
    ),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis dataKey="company" stroke="#BFE0CB" axisLine={false} tickLine={false} />
        <YAxis stroke="#BFE0CB" axisLine={false} tickLine={false} />
        <Tooltip />
        <Bar dataKey="days" fill="#9FCBAB" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}