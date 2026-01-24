import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Shuffle } from "lucide-react";

interface ControlPanelProps {
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onReset: () => void;
  onShuffle?: () => void;
  onSpeedChange: (value: number) => void;
  disabled?: boolean;
}

const ControlPanel = ({
  isPlaying,
  speed,
  onPlayPause,
  onReset,
  onShuffle,
  onSpeedChange,
  disabled = false,
}: ControlPanelProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={onPlayPause}
        disabled={disabled}
        className="rounded-xl hover-lift"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className="rounded-xl hover-lift"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
      
      {onShuffle && (
        <Button
          variant="outline"
          size="icon"
          onClick={onShuffle}
          disabled={isPlaying}
          className="rounded-xl hover-lift"
        >
          <Shuffle className="w-4 h-4" />
        </Button>
      )}
      
      <div className="flex items-center gap-2 ml-2">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Speed</span>
        <Slider
          value={[speed]}
          onValueChange={(v) => onSpeedChange(v[0])}
          min={1}
          max={100}
          step={1}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default ControlPanel;
