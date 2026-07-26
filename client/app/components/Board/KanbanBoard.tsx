import { useEffect, useState } from 'react';
import type { DragEvent } from 'react';
import { KanbanColumn } from './KanbanColumn';
import styles from '../../styles/Kanban.module.css';
import type { Application, Columns, DraggedObject } from '../../types';
import { authFetch } from '../../services/api';

const COLUMN_KEYS = [
  'saved',
  'applied',
  'interviewing',
  'offers',
  'rejected',
  'withdrawn',
];

const buildInitialColumns = (): Columns =>
  Object.fromEntries(
    COLUMN_KEYS.map((key) => [
      key,
      {
        id: key,
        title: key.charAt(0).toUpperCase() + key.slice(1),
        applications: [],
      },
    ]),
  );

type Props = { applications: Application[]; token: string };

export default function KanbanBoard({ applications, token }: Props) {
  const [columns, setColumns] = useState<Columns>(buildInitialColumns);
  const [draggedItem, setDraggedItem] = useState<DraggedObject | null>(null);

  useEffect(() => {
    const grouped: Record<string, Application[]> = Object.fromEntries(
      COLUMN_KEYS.map((k) => [k, []]),
    );
    applications.forEach((app) => {
      const key = app.status.toLowerCase();
      if (grouped[key]) grouped[key].push(app);
    });
    setColumns((prev) => {
      const next = { ...prev };
      COLUMN_KEYS.forEach((key) => {
        next[key] = { ...next[key], applications: grouped[key] };
      });
      return next;
    });
  }, [applications]);

  const handleDragStart = (
    _e: DragEvent<HTMLLIElement>,
    id: string,
    columnId: string,
  ) => {
    setDraggedItem({ id, columnId });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: DragEvent<HTMLDivElement>,
    targetColumnId: string,
  ) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.columnId === targetColumnId) {
      setDraggedItem(null);
      return;
    }

    const { id, columnId: sourceColumnId } = draggedItem;
    const movedApp = columns[sourceColumnId]?.applications.find(
      (app) => app.id === id,
    );
    if (!movedApp) {
      setDraggedItem(null);
      return;
    }

    setColumns((prev) => {
      const next = { ...prev };
      next[sourceColumnId] = {
        ...next[sourceColumnId],
        applications: next[sourceColumnId].applications.filter(
          (app) => app.id !== id,
        ),
      };
      next[targetColumnId] = {
        ...next[targetColumnId],
        applications: [
          ...next[targetColumnId].applications,
          { ...movedApp, status: targetColumnId },
        ],
      };
      return next;
    });

    try {
      await authFetch(`/api/applications/${id}`, token, {
        method: 'PATCH',
        body: JSON.stringify({ status: targetColumnId.toUpperCase() }),
      });
    } catch (err) {
      console.error('Failed to update status:', err);
    }

    setDraggedItem(null);
  };

  const removeTask = async (columnId: string, taskId: string) => {
    setColumns((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        applications: prev[columnId].applications.filter(
          (app) => app.id !== taskId,
        ),
      },
    }));
    try {
      await authFetch(`/api/applications/${taskId}`, token, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete application:', err);
    }
  };

  return (
    <main className={styles.board}>
      <div className={styles.boardHeader}>
        <div>
          <h1 className={styles.boardTitle}>APPLICATIONS</h1>
          <p className={styles.boardSubtitle}>
            Drag a Card to Update its Status.
          </p>
        </div>
      </div>
      <div className={styles.columnRow}>
        {Object.entries(columns).map(([key, column]) => (
          <KanbanColumn
            key={key}
            data={column}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onRemove={removeTask}
          />
        ))}
      </div>
    </main>
  );
}
