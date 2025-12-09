import { cn } from '@/lib/utils';

export default function StatusBadge({ status, size = 'default' }) {
  const colors = {
    processing: 'bg-blue-100 text-blue-700',
    awaiting_review: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
    archived: 'bg-gray-100 text-gray-700',
  };

  const sizes = {
    small: 'text-xs px-2 py-0.5',
    default: 'text-sm px-3 py-1',
  };

  const labels = {
    processing: 'Processing',
    awaiting_review: 'Awaiting Review',
    completed: 'Completed',
    archived: 'Archived',
  };

  return (
    <span className={cn('rounded-full font-medium', colors[status], sizes[size])}>
      {labels[status]}
    </span>
  );
}
