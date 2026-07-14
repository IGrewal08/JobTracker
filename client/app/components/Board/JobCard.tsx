import { useState } from "react";
import styles from "../../styles/Job.module.css";
import type { Job } from "../../types";

type Props = { data: Job; onSave: (data: FormData, jobId: string) => void; onDelete: (jobId: string) => void };

export function JobCard({ data, onSave, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(new FormData(e.currentTarget), data.id);
    setIsOpen(false);
  };

  return (
    <div className={styles.detailCard}>
      <div className={styles.detailHeader}>
        <div>
          <h2 className={styles.detailTitle}>{data.title}</h2>
          <div className={styles.detailMeta}>
            <span>{data.company}</span>
            <span>·</span>
            <span>{data.remote ? "Remote" : "On-site"}</span>
            <span>·</span>
            <span>{data.location}</span>
          </div>
        </div>
        <button className={styles.removeBtn} onClick={() => onDelete(data.id)}>Remove</button>
      </div>

      <a className={styles.detailLink} href={data.url} target="_blank" rel="noreferrer">View Original Posting →</a>

      <p className={styles.detailDescription}>{data.description}</p>

      <div className={styles.detailStatsRow}>
        <div className={styles.detailStat}>
          <span className={styles.detailStatLabel}>Salary</span>
          <span className={styles.detailStatValue}>
            {data.salaryMin ?? "—"} – {data.salaryMax ?? "—"}
          </span>
        </div>
        <div className={styles.detailStat}>
          <span className={styles.detailStatLabel}>Posted</span>
          <span className={styles.detailStatValue}>
            {data.postedAt ? new Date(data.postedAt).toLocaleDateString() : "—"}
          </span>
        </div>
        <div className={styles.detailStat}>
          <span className={styles.detailStatLabel}>Expires</span>
          <span className={styles.detailStatValue}>
            {data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : "—"}
          </span>
        </div>
      </div>

      <button className={styles.saveBtn} onClick={() => setIsOpen(true)}>Save to Board</button>

      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.modalClose} onClick={() => setIsOpen(false)}>Close</button>
            <h2 className={styles.modalTitle}>Save Application</h2>
            <form onSubmit={handleSubmit}>
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Status</legend>
                {["SAVED","APPLIED","INTERVIEWING","OFFER","REJECTED","WITHDRAWN"].map(s => (
                  <label key={s} className={styles.radioRow}>
                    <input type="radio" name="status" value={s} defaultChecked={s === "SAVED"} /> {s}
                  </label>
                ))}
              </fieldset>
              <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="appliedAt">Applied At</label>
                <input className={styles.formInput} type="date" id="appliedAt" name="appliedAt" />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="interviewAt">Interview At</label>
                <input className={styles.formInput} type="date" id="interviewAt" name="interviewAt" />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="offerAmount">Offer Amount</label>
                <input className={styles.formInput} type="number" id="offerAmount" name="offerAmount" min={0} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="notes">Notes</label>
                <textarea className={styles.formTextarea} id="notes" name="notes" maxLength={250} />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="coverLetter">Cover Letter</label>
                <textarea className={styles.formTextarea} id="coverLetter" name="coverLetter" maxLength={600} />
              </div>
              <button type="submit" className={styles.modalSubmit}>Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}