interface ProjectCardProps {
  name: string;
  isSelecting?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onSelect?: () => void;
}

function ProjectCard({ name, isSelecting = false, isSelected = false, onToggleSelect, onSelect }: ProjectCardProps) {
  return (
    <div
      onClick={isSelecting ? onToggleSelect : onSelect}
      className={[
        'bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center justify-between transition-all cursor-pointer hover:bg-slate-700/60',
        isSelected ? 'ring-2 ring-red-500/60 border-red-500/30' : '',
      ].join(' ')}
    >
      <h2 className="text-base font-semibold text-white">{name}</h2>
      {isSelecting && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 accent-red-500 cursor-pointer"
        />
      )}
    </div>
  );
}

export default ProjectCard;
