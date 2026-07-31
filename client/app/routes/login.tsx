import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from 'react-router';
import { LoginForm } from '../components/Auth/LoginForm';
import { API_BASE } from '../services/api';
import { getTokenFromRequest } from '../services/session';
import { useTheme } from '../context/ThemeContext';

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getTokenFromRequest(request);
  const url = new URL(request.url);
  const reason = url.searchParams.get('reason');
  console.log(reason);
  if (reason && typeof window !== 'undefined') {
    window.alert('Session Expired');
  }
  if (token) throw redirect('/board');
  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { error: body.message ?? 'Login failed, try again later.' };
  }

  const setCookie = res.headers.get('Set-Cookie');

  throw redirect('/dashboard', {
    headers: {
      ...(setCookie && { 'Set-Cookie': setCookie }),
    },
  });
}

export default function LoginPage() {
  useTheme();
  return <LoginForm />;
}
