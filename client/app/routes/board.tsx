import { useLoaderData } from 'react-router';
import KanbanBoard from '../components/Board/KanbanBoard';
import type { Route } from '../../.react-router/types/app/routes/+types/board';
import type { Application } from '../types';
import { authFetch } from '../services/api';

import { requireToken } from '../services/session';

export async function loader({ request }: Route.LoaderArgs) {
  const token = await requireToken(request);

  const res = await authFetch<Application[]>(`/api/applications`, token);

  const applications: Application[] = res;
  return { applications, token };
}

export default function BoardPage() {
  const { applications, token } = useLoaderData<typeof loader>();
  return (
    <KanbanBoard
      applications={applications}
      token={token}
    />
  );
}
