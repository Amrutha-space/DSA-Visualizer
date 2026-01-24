// Pointer labels and arrows for algorithm visualization
import { cn } from "@/lib/utils";
import type { ArrayBar } from "@/hooks/useSortingVisualizer";

interface SortingBarsProps {
  array: ArrayBar[];
}

const getBarColor = (state: ArrayBar["state"]): string => {
  switch (state) {
    case "comparing":
      return "bg-algo-compare";
    case "swapping":
      return "bg-algo-swap";
    case "sorted":
      return "bg-algo-sorted";
    case "pivot":
      return "bg-algo-active";
    default:
      return "bg-primary";
  }
};

const SortingBars = ({ array }: SortingBarsProps) => {
  const maxValue = Math.max(...array.map((bar) => bar.value));

  return (
    <div className="w-full">

      {/* Pointer Legend */}
      <div className="flex justify-center gap-6 text-xs font-semibold mb-3">
        <span className="text-blue-500">I → Left pointer</span>
        <span className="text-orange-500">J → Right pointer</span>
        <span className="text-green-500">PIVOT → Pivot element</span>
      </div>

      {/* Bars */}
    <div className="flex items-end justify-center gap-[2px] h-64 sm:h-80 w-full">
      {array.map((bar, index) => (
        <div key={index} className="relative flex flex-col items-center flex-1 max-w-4 h-full">
          
          {/* Pointer label */}
          {bar.pointer && (
            <div className="absolute -top-7 flex flex-col items-center text-xs font-bold text-red-500">
              <span>↓</span>
              <span>{bar.pointer.toUpperCase()}</span>
            </div>
          )}

          {/* Bar */}
          <div
            className={cn(
              "algo-bar w-full",
              getBarColor(bar.state),
              bar.state === "comparing" && "animate-pulse",
              bar.state === "swapping" && "scale-105"
            )}
            style={{
              height: `${(bar.value / maxValue) * 100}%`,
            }}
          />
        </div>
      ))}
    </div>
    </div>
  );
};

export default SortingBars;
