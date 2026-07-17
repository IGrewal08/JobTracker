import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import StatsChart from "../components/Dashboard/StatsChart";
import { authFetch } from "../services/api";
import type { Application } from "../types";
import { requireToken } from "../services/session";
import styles from "../styles/Dashboard.module.css";

export async function loader({ request }: LoaderFunctionArgs) {
    const token = await requireToken(request);
    const applications: Application[] = await authFetch<Application[]>("/api/applications", token);

    const now = Date.now();
    const byWeek = Array.from({ length: 8 }, (_, i) => {
        const start = new Date(now - (7 - i) * 7 * 86400000);
        const end   = new Date(now - (6 - i) * 7 * 86400000);

        return {
        week: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: applications.filter((a: any) => {
            const d = new Date(a.createdAt);
            return d >= start && d < end;
        })
    };
    });

    return { applications, byWeek }
}

export default function DashboardPage() {
    const {  applications, byWeek } = useLoaderData<typeof loader>();
    return (
        <main>
            <div id={styles.container}>
                <StatsChart applications={applications} byWeek={byWeek} />
            </div>
        </main>
  );
}