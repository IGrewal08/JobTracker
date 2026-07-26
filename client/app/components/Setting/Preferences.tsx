import {
  Form,
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from 'react-router';
import { authFetch } from '../../services/api';
import { requireToken } from '../../services/session';
import type { JobType, ScrapeFilter } from '../../types';
import styles from '../../styles/Preferences.module.css';

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireToken(request);
  const filter = await authFetch<ScrapeFilter | null>(
    '/api/preferences',
    token,
  );
  return { filter, token };
}

export async function action({ request }: ActionFunctionArgs) {
  const token = await requireToken(request);
  const formData = await request.formData();

  await authFetch('/api/preferences', token, {
    method: 'POST',
    body: JSON.stringify({
      keywords: formData.getAll('keyword'),
      remoteOnly: formData.get('remoteOnly') === 'true',
      salaryMin: formData.get('salaryMin') || undefined,
      jobTypes: formData.getAll('jobType'),
    }),
  });

  throw redirect('/jobs');
}

export default function PreferencesPage() {
  const { filter } = useLoaderData<typeof loader>();
  return (
    <div className={styles.container}>
      <div>
        <h3>Set Search Preferences</h3>
      </div>
      <Form method="post">
        <label>Keywords (what roles are you looking for?)</label>
        <input
          name="keyword"
          placeholder="React, Node.js, TypeScript..."
          defaultValue={filter?.keywords.join(', ')}
        />

        <label>Remote only?</label>
        <select
          name="remoteOnly"
          defaultValue={String(filter?.remoteOnly ?? false)}
        >
          <option value="false">No preference</option>
          <option value="true">Remote Only</option>
        </select>

        <label>Minimum salary</label>
        <input
          type="number"
          min={0}
          name="salaryMin"
          defaultValue={filter?.salaryMin ?? ''}
        />

        <fieldset>
          <legend>Job Types</legend>
          {['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'].map((t) => (
            <label key={t}>
              <input
                className={styles.types}
                type="checkbox"
                name="jobType"
                value={t}
                defaultChecked={filter?.jobTypes.includes(t as JobType)}
              />
              {t.replace('_', ' ')}
            </label>
          ))}
        </fieldset>

        <button type="submit">Save Preferences</button>
      </Form>
    </div>
  );
}
