import styles from '../../styles/StatCard.module.css';
type Props = {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
};

export function StatCard({ label, value, sub, accent = false }: Props) {
  return (
    <div className={`${styles.card} ${accent ? styles.accent : ''}`}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  );
}
