import { redirect } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { getTokenFromRequest } from '../services/session';

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getTokenFromRequest(request);
  if (token) throw redirect('/board');
  //window.alert("Token Expired!");
  throw redirect('/login');
}
