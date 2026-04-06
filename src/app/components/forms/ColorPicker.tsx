import { cn } from '../ui/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const COLOR_PRESETS = [
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#22c55e', // green-500
  '#14b8a6', // teal-500
  '#0ea5e9', // sky-500
  '#3b82f6', // blue-500
];

export default function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {COLOR_PRESETS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "w-8 h-8 rounded-full transition-all border-2",
            value === color
              ? "border-slate-800 scale-110"
              : "border-transparent hover:scale-110 hover:border-slate-300"
          )}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
}