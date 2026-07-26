import {
  isRouteErrorResponse,
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useRouteError,
  type LoaderFunctionArgs,
} from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import { requireToken } from './services/session';
import { authFetch } from './services/api';
import type { User } from './types';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const token = await requireToken(request);
    if (!token) throw redirect('/login');
    const user: User = await authFetch('/api/user', token);
    return { user };
  } catch (err) {
    throw redirect('/login');
  }
}

export default function AppLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <Header name={user.name} />
      <Outlet />
      <Footer />
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Uh oh! ({error.status})</h1>
        <p>
          {error.status === 404
            ? "This page doesn't exist!"
            : 'Something went wrong.'}
        </p>
        <Link to="/">Return to home</Link>
      </div>
    );
  }

  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return (
    <div style={{ padding: '2rem', textAlign: 'center', alignItems: 'center' }}>
      <h1>Application Error</h1>
      <p>An unexpected error occurred: {errorMessage}</p>
      <button onClick={() => {}}>Reload page</button>
    </div>
  );
}
