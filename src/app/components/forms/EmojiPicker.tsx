import { cn } from '../ui/utils';

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  className?: string;
}

const EMOJI_PRESETS = [
  '🎯', '✈️', '💼', '💰', '🏠', '❤️', '🧠', '💪', '🌱', '🎨', '📚', '🚴',
  '🎵', '💻', '📱', '🎮', '🍎', '☕', '🌟', '🔥', '💡', '🚀', '🌈', '🐱',
];

export default function EmojiPicker({ value, onChange, className }: EmojiPickerProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {EMOJI_PRESETS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          className={cn(
            "w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all",
            value === emoji
              ? "bg-indigo-100 ring-2 ring-indigo-600"
              : "bg-slate-50 hover:bg-slate-100 text-slate-600"
          )}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}