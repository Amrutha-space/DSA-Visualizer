import Layout from "@/components/layout/Layout";
import VisualizerCard from "@/components/ui/VisualizerCard";
import ControlPanel from "@/components/ui/ControlPanel";
import AlgorithmSelector from "@/components/ui/AlgorithmSelector";
import SortingBars from "@/components/visualizers/SortingBars";
import { useSortingVisualizer, SortingAlgorithm } from "@/hooks/useSortingVisualizer";
import { Badge } from "@/components/ui/badge";

const sortingAlgorithms = [
  { id: "bubble", name: "Bubble Sort", description: "O(n²)" },
  { id: "selection", name: "Selection Sort", description: "O(n²)" },
  { id: "insertion", name: "Insertion Sort", description: "O(n²)" },
  { id: "merge", name: "Merge Sort", description: "O(n log n)" },
  { id: "quick", name: "Quick Sort", description: "O(n log n)" },
];

const SortingPage = () => {
  const {
    array,
    isPlaying,
    speed,
    algorithm,
    comparisons,
    swaps,
    setSpeed,
    setAlgorithm,
    shuffle,
    reset,
    togglePlayPause,
  } = useSortingVisualizer(40);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Sorting Algorithms</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch how different sorting algorithms organize data step by step.
            Compare their efficiency through visual animations.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <AlgorithmSelector
            algorithms={sortingAlgorithms}
            selected={algorithm}
            onSelect={(id) => setAlgorithm(id as SortingAlgorithm)}
            disabled={isPlaying}
          />
        </div>

        <VisualizerCard
          title={sortingAlgorithms.find((a) => a.id === algorithm)?.name || "Sorting"}
          description={`Time Complexity: ${sortingAlgorithms.find((a) => a.id === algorithm)?.description}`}
          controls={
            <ControlPanel
              isPlaying={isPlaying}
              speed={speed}
              onPlayPause={togglePlayPause}
              onReset={reset}
              onShuffle={shuffle}
              onSpeedChange={setSpeed}
            />
          }
        >
          <SortingBars array={array} />
          
          <div className="flex justify-center gap-4 mt-6">
            <Badge variant="secondary" className="text-sm px-4 py-2 rounded-xl">
              Comparisons: {comparisons}
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2 rounded-xl">
              Swaps: {swaps}
            </Badge>
          </div>
        </VisualizerCard>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-3">Color Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary" />
              <span className="text-sm text-muted-foreground">Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-algo-compare" />
              <span className="text-sm text-muted-foreground">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-algo-swap" />
              <span className="text-sm text-muted-foreground">Swapping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-algo-active" />
              <span className="text-sm text-muted-foreground">Pivot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-algo-sorted" />
              <span className="text-sm text-muted-foreground">Sorted</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SortingPage;
