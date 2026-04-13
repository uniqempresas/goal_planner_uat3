import { motion } from 'framer-motion';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  showLabel?: boolean;
}

export function CircularProgress({
  progress,
  size = 44,
  strokeWidth = 4,
  color = '#6366F1',
  bgColor = '#E2E8F0',
  showLabel = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (clampedProgress / 100) * circumference }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-[10px] font-semibold text-slate-600">
          {Math.round(clampedProgress)}%
        </span>
      )}
    </div>
  );
}