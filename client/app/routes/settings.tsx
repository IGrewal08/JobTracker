import {
  data,
  Outlet,
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from 'react-router';
import { authFetch } from '../services/api';
import { requireToken } from '../services/session';
import { Setting } from '../components/Setting/Setting';
import styles from '../styles/Setting.module.css';
import type { User } from '../types';

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireToken(request);
  const user: User = await authFetch('/api/user', token);
  return { user };
}

export async function action({ request }: ActionFunctionArgs) {
  const token = await requireToken(request);
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'update-name') {
    const newName = formData.get('newName');

    try {
      await authFetch('/api/user', token, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName }),
      });
    } catch (err) {
      return { error: 'Failed to update name' };
    }
    return redirect('/dashboard');
  }

  if (intent === 'delete-account') {
    try {
      await authFetch('/api/user', token, { method: 'DELETE' });
    } catch (err) {
      return { error: 'Failed to delete account' };
    }
    return redirect('/logout');
  }
  return data({ error: 'Invalid Action' }, { status: 400 });
}

export default function SettingPage() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <main className={styles.main}>
      <Setting name={user.name} />
      <div className={styles.divider}></div>
      <Outlet />
    </main>
  );
}
