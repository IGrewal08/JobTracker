import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import StatsChart from '../components/Dashboard/StatsChart';
import { authFetch } from '../services/api';
import type { Application } from '../types';
import { requireToken } from '../services/session';

type Week = {
  week: string;
  count: number;
}[];

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireToken(request);
  const applications: Application[] = await authFetch<Application[]>(
    '/api/applications',
    token,
  );

  const now = Date.now();
  const byWeek: Week = Array.from({ length: 8 }, (_, i) => {
    const start = new Date(now - (7 - i) * 7 * 86400000);
    const end = new Date(now - (6 - i) * 7 * 86400000);

    return {
      week: start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      count: applications.filter((a: Application) => {
        const d = new Date(a.createdAt);
        return d >= start && d < end;
      }).length,
    };
  });
  return { applications, byWeek };
}

export default function DashboardPage() {
  const { applications, byWeek } = useLoaderData<typeof loader>();
  return (
    <StatsChart
      applications={applications}
      byWeek={byWeek}
    />
  );
}
