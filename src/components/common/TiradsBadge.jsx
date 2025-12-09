import { cn } from '@/lib/utils';

export default function TiradsBadge({ category, size = 'default' }) {
  const colors = {
    1: 'bg-emerald-100 text-emerald-700',
    2: 'bg-green-100 text-green-700',
    3: 'bg-yellow-100 text-yellow-700',
    4: 'bg-orange-100 text-orange-700',
    5: 'bg-red-100 text-red-700',
  };

  const sizes = {
    small: 'text-xs px-2 py-0.5',
    default: 'text-sm px-3 py-1',
  };

  return (
    <span className={cn('rounded-full font-medium', colors[category], sizes[size])}>
      TI-RADS {category}
    </span>
  );
}
