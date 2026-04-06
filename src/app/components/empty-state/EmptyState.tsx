import { Link } from 'react-router';
import { cn } from '../ui/utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
      <div className="mb-4 text-slate-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-center max-w-md mb-6">{description}</p>
      {actionLabel && (
        actionHref ? (
          <Link
            to={actionHref}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {actionLabel}
          </Link>
        ) : actionOnClick ? (
          <button
            onClick={actionOnClick}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {actionLabel}
          </button>
        ) : null
      )}
    </div>
  );
}