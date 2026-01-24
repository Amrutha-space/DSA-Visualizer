import { cn } from "@/lib/utils";

interface AlgorithmSelectorProps {
  algorithms: { id: string; name: string; description?: string }[];
  selected: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

const AlgorithmSelector = ({
  algorithms,
  selected,
  onSelect,
  disabled = false,
}: AlgorithmSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {algorithms.map((algo) => (
        <button
          key={algo.id}
          onClick={() => onSelect(algo.id)}
          disabled={disabled}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
            "hover-lift disabled:opacity-50 disabled:cursor-not-allowed",
            selected === algo.id
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {algo.name}
        </button>
      ))}
    </div>
  );
};

export default AlgorithmSelector;
