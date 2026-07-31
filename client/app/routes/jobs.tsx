import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { authFetch } from '../services/api';
import { JobList } from '../components/Board/JobList';
import type { Job } from '../types';
import { JobFilters, type FilterValues } from '../components/Board/JobFilters';
import { useCallback, useState } from 'react';
import { requireToken } from '../services/session';
import { useSocket } from '../hooks/useSocket';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import styles from '../styles/Job.module.css';

export interface PaginatedJobsResponse {
  data: Job[];
  nextCursor: string | number | null;
  hasMore: boolean;
}

export interface JobMetadata {
  companies: string[];
  locations: string[];
  tags: string[];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireToken(request);

  const initialResponse = await authFetch<PaginatedJobsResponse>(
    '/api/jobs?limit=10',
    token,
  );

  const metadata = await authFetch<JobMetadata>('/api/jobs/metadata', token);

  const jobsWithTimeAgo = initialResponse.data.map((job) => ({
    ...job,
    timeAgo: formatTimeAgo(job.createdAt),
  }));

  return {
    initialJobs: jobsWithTimeAgo,
    initialNextCursor: initialResponse.nextCursor,
    initialHasMore: initialResponse.hasMore,
    companies: metadata.companies,
    locations: metadata.locations,
    tags: metadata.tags,
    token,
  };
}

export default function JobsPage() {
  const {
    initialJobs: jobsWithTimeAgo,
    initialNextCursor,
    initialHasMore,
    companies,
    locations,
    tags,
    token,
  } = useLoaderData<typeof loader>();

  const [jobs, setJobs] = useState<Job[]>(jobsWithTimeAgo);
  const [nextCursor, setNextCursor] =
    useState<PaginatedJobsResponse['nextCursor']>(initialNextCursor);
  const [hasMore, setHasMore] =
    useState<PaginatedJobsResponse['hasMore']>(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(jobs[0] ?? null);

  useSocket({
    token,
    onNewJob: (job) => setJobs((prev) => [job, ...prev]),
  });

  const buildFilterParams = (filters: FilterValues | null) => {
    const params = new URLSearchParams();
    if (!filters) return params;

    if (filters.search) params.set('search', filters.search);
    if (filters.remote) params.set('remote', filters.remote);
    if (filters.postedWithin) params.set('postedWithin', filters.postedWithin);
    if (filters.salaryMin) params.set('salaryMin', filters.salaryMin);
    if (filters.salaryMax) params.set('salaryMax', filters.salaryMax);
    if (filters.sort) params.set('sort', filters.sort);

    filters.jobTypes?.forEach((v) => params.append('jobType', v));
    filters.companies?.forEach((v) => params.append('company', v));
    filters.locations?.forEach((v) => params.append('location', v));
    filters.tags?.forEach((v) => params.append('tag', v));

    return params;
  };

  const handleFilterSubmit = async (filters: FilterValues) => {
    try {
      setActiveFilters(filters);
      const params = buildFilterParams(filters);
      params.set('limit', '10');
      params.delete('cursor');

      const response = await authFetch(`/api/jobs?${params.toString()}`, token);
      const jobsWithTimeAgo: Job[] = response.data.map((job: Job) => ({
        ...job,
        timeAgo: formatTimeAgo(job.createdAt),
      }));

      setJobs(jobsWithTimeAgo as Job[]);
      setNextCursor(response.nextCursor);
      setHasMore(response.hasMore);

      if (jobsWithTimeAgo.length > 0) {
        setSelectedJob(jobsWithTimeAgo[0]);
      } else {
        setSelectedJob(null);
      }
    } catch (err: any) {
      console.error('Failed to fetch filtered jobs:', err.message);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !nextCursor) return;

    setIsLoadingMore(true);
    try {
      const params = buildFilterParams(activeFilters);
      params.set('limit', '10');
      params.set('cursor', String(nextCursor));

      const response = await authFetch<PaginatedJobsResponse>(
        `/api/jobs?${params.toString()}`,
        token,
      );

      const newJobsWithTimeAgo: Job[] = response.data.map((job: Job) => ({
        ...job,
        timeAgo: formatTimeAgo(job.createdAt),
      }));

      setJobs((prev) => {
        const existingIds = new Set(prev.map((j) => j.id));
        const uniqueNewJobs = newJobsWithTimeAgo.filter(
          (j) => !existingIds.has(j.id),
        );
        return [...prev, ...uniqueNewJobs];
      });
      setNextCursor(response.nextCursor);
      setHasMore(response.hasMore);
    } catch (err: any) {
      console.error('Failed to load more jobs:', err.message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, nextCursor, activeFilters, token]);

  const handleSave = async (formData: FormData, jobId: string) => {
    try {
      await authFetch(`/api/applications/${jobId}`, token, {
        method: 'POST',
        body: JSON.stringify({
          jobId,
          status: formData.get('status') || 'SAVED',
          appliedAt: formData.get('appliedAt') || undefined,
          interviewAt: formData.get('interviewAt') || undefined,
          offerAmount: formData.get('offerAmount') || undefined,
          notes: formData.get('notes') || undefined,
          coverLetter: formData.get('coverLetter') || undefined,
        }),
      });
    } catch (err: any) {
      console.error('Save failed:', err.message);
    }
  };

  const handleDelete = (jobId: string) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    setJobs(updatedJobs);

    if (updatedJobs.length === 0) {
      setSelectedJob(null);
    } else {
      const deletedIndex = jobs.findIndex((job) => job.id === jobId);
      const nextIndex = Math.min(deletedIndex, updatedJobs.length - 1);
      setSelectedJob(updatedJobs[nextIndex]);
    }
  };

  return (
    <div className={styles.jobs}>
      <div className={styles.jobsHeader}>
        <div>
          <h1 className={styles.jobsTitle}>JobBoard</h1>
          <p className={styles.jobsSubtitle}>
            Search for jobs based on your preferences.
          </p>
        </div>
      </div>
      <div className={styles.container}>
        <JobFilters
          companies={companies}
          locations={locations}
          tags={tags}
          onSubmit={handleFilterSubmit}
        />
        <JobList
          jobs={jobs}
          selectedJob={selectedJob}
          setSelectedJob={setSelectedJob}
          onSave={handleSave}
          onDelete={handleDelete}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
}
