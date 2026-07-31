import styles from '../../styles/Job.module.css';
import { getLogoColor } from '../../utils/formatTimeAgo.ts';
import { JobCard } from './JobCard';
import type { Job } from '../../types';
import { useEffect, useRef } from 'react';

type Props = {
  jobs: Job[];
  selectedJob: Job | null;
  setSelectedJob: (selectedJob: Job | null) => void;
  onSave: (formData: FormData, jobId: string) => void;
  onDelete: (jobId: string) => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
};

export function JobList({
  jobs,
  selectedJob,
  setSelectedJob,
  onSave,
  onDelete,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadingRef = useRef(isLoadingMore);
  useEffect(() => {
    loadingRef.current = isLoadingMore;
  }, [isLoadingMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current && hasMore) {
          onLoadMore();
        }
      },
      {
        root: sentinel.parentElement,
        threshold: 0.1,
      },
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, onLoadMore]);

  return (
    <div className={styles.splitLayout}>
      <div className={styles.listColumn}>
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`${styles.jobCard} ${selectedJob?.id === job.id ? styles.jobCardSelected : ''}`}
            onClick={() => setSelectedJob(job)}
          >
            <div
              className={styles.logoCircle}
              style={{ backgroundColor: getLogoColor(job.company) }}
            >
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div className={styles.jobCardDivider} />
            <div className={styles.jobCardBody}>
              <h3 className={styles.jobTitle}>{job.title}</h3>
              <p className={styles.jobMeta}>
                {job.company} · {job.remote ? 'Remote' : 'On-site'} ·{' '}
                {job.location}
              </p>
              <div className={styles.jobTags}>
                {job.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={styles.jobTagChip}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span className={styles.jobTimeAgo}>{job.timeAgo}</span>
          </div>
        ))}
        {/* Sentinel Element for IntersectionObserver */}
        <div
          ref={sentinelRef}
          className={styles.sentinel}
        >
          {isLoadingMore && (
            <p className={styles.loadingText}>Loading more jobs...</p>
          )}
          {!hasMore && jobs.length > 0 && (
            <p className={styles.endText}>
              You've reached the end of the list.
            </p>
          )}
        </div>
      </div>

      <div className={styles.detailColumn}>
        {selectedJob ? (
          <JobCard
            data={selectedJob}
            onSave={onSave}
            onDelete={onDelete}
          />
        ) : (
          <div className={styles.detailCard}>
            <p>Select a job to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
