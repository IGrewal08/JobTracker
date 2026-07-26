import type { DragEvent } from 'react';
import styles from '../../styles/Kanban.module.css';
import type { Application } from '../../types';

type ColumnData = { id: string; title: string; applications: Application[] };

type Props = {
  data: ColumnData;
  onDrop: (e: DragEvent<HTMLDivElement>, columnId: string) => void;
  onDragStart: (
    e: DragEvent<HTMLLIElement>,
    id: string,
    columnId: string,
  ) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onRemove: (columnId: string, taskId: string) => void;
};

const COLUMN_STYLE: Record<string, { dot: string; bg: string; text: string }> =
  {
    saved: { dot: '#378ADD', bg: '#E6F1FB', text: '#185FA5' },
    applied: { dot: '#1D9E75', bg: '#E1F5EE', text: '#0F6E56' },
    interviewing: { dot: '#BA7517', bg: '#FAEEDA', text: '#854F0B' },
    offers: { dot: '#639922', bg: '#EAF3DE', text: '#3B6D11' },
    rejected: { dot: '#D85A30', bg: '#FAECE7', text: '#993C1D' },
    withdrawn: { dot: '#888780', bg: '#F1EFE8', text: '#5F5E5A' },
  };

export function KanbanColumn({
  data,
  onDrop,
  onDragStart,
  onDragOver,
  onRemove,
}: Props) {
  const palette = COLUMN_STYLE[data.id] ?? COLUMN_STYLE.saved;

  return (
    <div
      className={styles.column}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, data.id)}
    >
      <div className={styles.columnHeader}>
        <div className={styles.columnHeaderLeft}>
          <span
            className={styles.columnDot}
            style={{ backgroundColor: palette.dot }}
          />
          <h3 className={styles.columnName}>{data.title}</h3>
        </div>
        <span className={styles.columnCount}>{data.applications.length}</span>
      </div>

      <ul
        className={styles.cardList}
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
      >
        {data.applications.map((app) => (
          <li
            key={app.id}
            className={styles.card}
            draggable
            onDragStart={(e) => onDragStart(e, app.id, data.id)}
          >
            <div className={styles.cardTop}>
              <span
                className={styles.pill}
                style={{
                  backgroundColor: app.job.remote ? '#E6F1FB' : '#F1EFE8',
                  color: app.job.remote ? '#185FA5' : '#5F5E5A',
                }}
              >
                {app.job.remote ? 'Remote' : 'On-site'}
              </span>
              <button
                className={styles.removeBtn}
                onClick={() => onRemove(data.id, app.id)}
                aria-label="Remove application"
              >
                ×
              </button>
            </div>

            <p className={styles.cardTitle}>{app.job.title}</p>
            <p className={styles.cardCompany}>{app.job.company}</p>

            <hr className={styles.cardDivider} />

            <div className={styles.cardFooter}>
              <span className={styles.cardDate}>
                {new Date(app.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {app.notes && <span>Has notes</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
