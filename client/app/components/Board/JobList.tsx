import styles from '../../styles/Job.module.css';
import { getLogoColor } from '../../utils/formatTimeAgo.ts';
import { JobCard } from './JobCard';
import type { Job } from '../../types';

type Props = {
  jobs: Job[];
  selectedJob: Job | null;
  setSelectedJob: (selectedJob: Job | null) => void;
  onSave: (formData: FormData, jobId: string) => void;
  onDelete: (jobId: string) => void;
};

export function JobList({
  jobs,
  selectedJob,
  setSelectedJob,
  onSave,
  onDelete,
}: Props) {
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
