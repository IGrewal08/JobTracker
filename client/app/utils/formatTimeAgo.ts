export function formatTimeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

const LOGO_COLORS = [
  '#378ADD',
  '#1D9E75',
  '#BA7517',
  '#639922',
  '#D85A30',
  '#534AB7',
];

export function getLogoColor(company: string): string {
  const hash = company.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return LOGO_COLORS[hash % LOGO_COLORS.length];
}
