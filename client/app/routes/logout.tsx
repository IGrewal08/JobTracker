import { redirect, type ActionFunctionArgs } from 'react-router';
import { API_BASE } from '../services/api';

export async function loader({ request }: ActionFunctionArgs) {
  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    headers: {
      Cookie: request.headers.get('Cookie') ?? '',
    },
  });

  const setCookie = res.headers.get('Set-Cookie');

  throw redirect('/login', {
    headers: {
      ...(setCookie && { 'Set-Cookie': setCookie }),
    },
  });
}
