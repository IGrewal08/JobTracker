import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import StatsChart from "../components/Dashboard/StatsChart";
import { authFetch } from "../services/api";
import type { Application } from "../types";
import { requireToken } from "../services/session";
import styles from "../styles/Dashboard.module.css";

export async function loader({ request }: LoaderFunctionArgs) {
    const token = await requireToken(request);
    const applications: Application[] = await authFetch<Application[]>("/api/applications", token);

    return { applications };
}

export default function DashboardPage() {
    const {  applications } = useLoaderData<typeof loader>();
    return (
        <main>
            <div id={styles.container}>
                <StatsChart applications={applications} />
            </div>
        </main>
  );
}