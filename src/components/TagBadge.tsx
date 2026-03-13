import { X } from 'lucide-react';

interface TagBadgeProps {
  tag: string;
  onClick?: (tag: string) => void;
  onDelete?: (tag: string) => void;
  active?: boolean;
}

const TAG_PALETTES = [
  { bg: 'bg-indigo-100', text: 'text-indigo-700', ring: 'ring-indigo-300' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-300' },
  { bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-300' },
  { bg: 'bg-rose-100', text: 'text-rose-700', ring: 'ring-rose-300' },
  { bg: 'bg-sky-100', text: 'text-sky-700', ring: 'ring-sky-300' },
] as const;

function hashTag(tag: string): number {
  let h = 0;
  for (const ch of tag) h = (h * 31 + ch.charCodeAt(0)) & 0xffff;
  return h % TAG_PALETTES.length;
}

export function TagBadge({ tag, onClick, onDelete, active = false }: TagBadgeProps) {
  const palette = TAG_PALETTES[hashTag(tag)];

  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium select-none',
        palette.bg,
        palette.text,
        active ? `ring-2 ${palette.ring}` : '',
        onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => onClick?.(tag)}
    >
      #{tag}
      {onDelete && (
        <button
          type="button"
          className="ml-0.5 hover:opacity-60 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(tag);
          }}
          aria-label={`${tag} 태그 제거`}
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
}
